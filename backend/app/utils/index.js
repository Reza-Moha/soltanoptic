require("dotenv").config();
const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");
const CreateError = require("http-errors");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { PERMISSIONS } = require("../constants");
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
const getRolePermissions = (role) => {
  return PERMISSIONS[role] || [];
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
};
