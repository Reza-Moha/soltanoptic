require("dotenv").config();
const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");
const CreateError = require("http-errors");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { PERMISSIONS } = require("../constants");
const moment = require("jalali-moment");
const { InvoiceModel } = require("../models/Invoice/Invoice.model");
const { CompanyModel } = require("../models/Company.model");
const {
  UserPrescriptionModel,
} = require("../models/Invoice/UserPrescription.model");
const LensModel = require("../models/lens/Lens.model");
const FormData = require("form-data");
const jalaali = require("jalaali-js");
const {
  LensOrderStatusTracking,
} = require("../models/Invoice/LensOrderStatusTracking.model");
const randomNumberGenerator = () => {
  const number = Math.floor(Math.random() * 100000 + 1);
  if (number.toString().length > 4) {
    return number;
  }
  return randomNumberGenerator();
};

function SignAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const { phoneNumber, permissions } = await UserModel.findByPk(userId);
    const payload = {
      phoneNumber,
      permissions,
    };
    const options = {
      expiresIn: "20m",
    };
    JWT.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      options,
      (err, token) => {
        if (err) reject(CreateError.InternalServerError("خطای سروری"));
        resolve(token);
      },
    );
  });
}

function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const { phoneNumber, permissions } = await UserModel.findByPk(userId);
    const payload = {
      phoneNumber,
      permissions,
    };
    const options = {
      expiresIn: "30d",
    };
    JWT.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      options,
      async (err, token) => {
        if (err) reject(CreateError.InternalServerError("خطای سروری"));
        resolve(token);
      },
    );
  });
}

function VerifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err)
            return reject(
              CreateError.Unauthorized("وارد حساب کاربری خود شوید"),
            );
          const { phoneNumber } = payload || {};
          const user = await UserModel.findOne({
            where: { phoneNumber },
            attributes: { exclude: ["otp", "createdAt", "updatedAt"] },
          });
          if (!user) {
            return reject(CreateError.Unauthorized("حساب کاربری یافت نشد"));
          }
          return resolve(user.phoneNumber);
        } catch (e) {
          return reject(CreateError.Unauthorized("حساب کاربری یافت نشد"));
        }
      },
    );
  });
}

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

const deleteFileInPublic = (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    console.warn(`Invalid filePath:`, filePath);
    return;
  }

  const fullPath = path.join(__dirname, "../public", filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`File deleted: ${fullPath}`);
  } else {
    console.warn(`File not found: ${fullPath}`);
  }
};

function filterEmptyFieldsInDatabase(data) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => value !== null && value !== undefined && value !== "",
    ),
  );
}

function validateNationalId(code) {
  if (!/^\d{10}$/.test(code)) {
    return false;
  }
  const digits = code.split("").map(Number);
  if (digits.every((digit) => digit === digits[0])) {
    return false;
  }
  const checkSum = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const remainder = checkSum % 11;
  const controlDigit = digits[9];
  return (
    (remainder < 2 && controlDigit === remainder) ||
    (remainder >= 2 && controlDigit === 11 - remainder)
  );
}

function isValidBankCardNumber(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

async function sendSms(RecNumber, code) {
  const accessHash = process.env.SMS_ACCESS_HASH;
  const phoneNumber = process.env.SMS_PHONENUMBER;
  const patternId = process.env.SMS_PATTERN_ID;
  try {
    const response = await axios.get(
      `http://smspanel.trez.ir/SendPatternWithUrl.ashx?AccessHash=${accessHash}&PhoneNumber=${phoneNumber}&PatternId=${patternId}&RecNumber=${RecNumber}&Smsclass=1&token1=${code}`,
    );
    return { success: true, message: response.data.Message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function smsThanksPurchase(
  RecNumber,
  gender,
  invoiceNumber,
  customerName,
) {
  const accessHash = process.env.SMS_ACCESS_HASH;
  const phoneNumber = process.env.SMS_PHONENUMBER;
  const patternId = process.env.SMS_TANKS_PATTER_ID;
  try {
    const response = await axios.get(
      `http://smspanel.trez.ir/SendPatternWithUrl.ashx?AccessHash=${accessHash}&PhoneNumber=${phoneNumber}&PatternId=${patternId}&RecNumber=${RecNumber}&Smsclass=1&token1=${gender}&token2=${customerName}&token3=${invoiceNumber}`,
    );
    return { success: true, message: response.data.Message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

const getRolePermissions = (role) => {
  return PERMISSIONS[role] || [];
};

const farsiDigitToEnglish = (farsiNumber) => {
  const digitMap = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  farsiNumber = farsiNumber.replace(/٬/g, "");

  let englishNumber = "";
  for (const ch of farsiNumber || "") {
    englishNumber += digitMap[ch] || ch;
  }

  return parseFloat(englishNumber) || 0;
};

const convertToJalali = (isoDate) => {
  let miladiMoment = moment(isoDate);
  let jalaliDate = miladiMoment.locale("fa").format("YYYY/MM/DD HH:mm:ss");
  return jalaliDate;
};

function convertJalaliToGregorian(jalaliDate) {
  const [jy, jm, jd] = jalaliDate.split("-").map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy.toString().padStart(4, "0")}-${gm.toString().padStart(2, "0")}-${gd.toString().padStart(2, "0")}`;
}

const convertToPersianNumber = (num) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};

const formatNumberWithCommas = (num) => {
  return convertToPersianNumber(
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  );
};
const formatToPersianDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("fa-IR", options).format(
    new Date(date),
  );
  const parts = formattedDate.split(" ");
  return `${parts[0]}/${parts[1]}/${parts[2]}`;
};

const getInvoiceDetails = async (invoiceId, userId) => {
  try {
    const invoice = await InvoiceModel.findByPk(invoiceId, {
      include: [
        {
          model: CompanyModel,
          as: "company",
          attributes: ["companyName", "whatsappNumber"],
        },
        {
          model: UserModel,
          as: "employee",
          attributes: ["fullName", "jobTitle"],
        },
        {
          model: UserModel,
          as: "customer",
          attributes: ["fullName", "gender"],
        },
        {
          model: UserPrescriptionModel,
          as: "prescriptions",
          include: [
            {
              model: LensModel,
              as: "lens",
              attributes: {
                exclude: ["description", "LensGroupId", "LensCategoryId"],
              },
              include: [
                {
                  model: LensOrderStatusTracking,
                  as: "lensOrderStatusTracking",
                },
              ],
            },
          ],
          attributes: {
            exclude: ["updatedAt", "frameId", "createdAt"],
          },
        },
      ],
    });

    if (!invoice) {
      console.error(`Invoice with ID ${invoiceId} not found.`);
      return null;
    }
    if (invoice) {
      invoice.lensOrderStatus = "orderLenses";
      await invoice.save();
    }
    const prescription = invoice.prescriptions[0];

    if (prescription?.lens?.lensOrderStatusTracking?.id) {
      const trackingId = prescription.lens.lensOrderStatusTracking.id;

      const trackingInstance =
        await LensOrderStatusTracking.findByPk(trackingId);

      if (trackingInstance) {
        trackingInstance.lensOrderedBy = userId;
        trackingInstance.lensOrderAt = new Date();
        await trackingInstance.save();
      }
    }

    return invoice;
  } catch (error) {
    console.error("❌ خطا در دریافت جزئیات فاکتور:", error);
    return null;
  }
};

const sendPDFToTelegramGroup = async (pdfPath, invoiceId) => {
  const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`;

  try {
    const formData = new FormData();
    formData.append("chat_id", process.env.TELEGRAM_GROUP_CHAT);
    formData.append("document", fs.createReadStream(pdfPath));

    const response = await axios.post(telegramUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    if (response.status === 200) {
      const invoice = await InvoiceModel.findByPk(invoiceId);
      if (invoice) {
        await invoice.update({ lensOrderAt: new Date() });
      }
    }
  } catch (error) {
    console.error("Error sending PDF to Telegram group:", error);
  }
};

const orderDeliverySms = async (
  RecNumber,
  gender,
  invoiceNumber,
  customerName,
  responsibleForDelivery,
) => {
  const accessHash = process.env.SMS_ACCESS_HASH;
  const phoneNumber = process.env.SMS_PHONENUMBER;
  const patternId = process.env.ORDER_DELEVIRY_SMS_PATTER_ID;
  try {
    const response = await axios.get(
      `http://smspanel.trez.ir/SendPatternWithUrl.ashx?AccessHash=${accessHash}&PhoneNumber=${phoneNumber}&PatternId=${patternId}&RecNumber=${RecNumber}&Smsclass=1&token1=${gender}&token2=${customerName}&token3=${invoiceNumber}&token4=${responsibleForDelivery}`,
    );
    return { success: true, message: response.data.Message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  randomNumberGenerator,
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken,
  deleteInvalidPropertyInObject,
  deleteFileInPublic,
  filterEmptyFieldsInDatabase,
  validateNationalId,
  isValidBankCardNumber,
  sendSms,
  getRolePermissions,
  farsiDigitToEnglish,
  smsThanksPurchase,
  convertToJalali,
  convertToPersianNumber,
  formatNumberWithCommas,
  formatToPersianDate,
  convertJalaliToGregorian,
  getInvoiceDetails,
  sendPDFToTelegramGroup,
  orderDeliverySms,
};
