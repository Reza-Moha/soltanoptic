const Controller = require("../../Controller");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  createNewPurchaseInvoiceSchema,
  sendSmsThanksForThePurchaseSchema,
} = require("../../../validation/admin/admin.schema");
const { UserModel } = require("../../../models/User.model");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../../../libs/DBConfig");
const { InvoiceModel } = require("../../../models/Invoice/Invoice.model");

const {
  PaymentInfoModel,
} = require("../../../models/Invoice/PaymentInfo.model");
const {
  farsiDigitToEnglish,
  smsThanksPurchase,
  convertJalaliToGregorian,
  sendPDFToTelegramGroup,
  normalizeEmptyUUIDs,
  orderDeliverySms,
} = require("../../../utils");
const { CompanyModel } = require("../../../models/Company.model");
const { BankModel } = require("../../../models/Bank.model");
const { InsuranceModel } = require("../../../models/Insurance.model");
const generateCustomerInvoicePdf = require("../../../utils/createCustomerInvoicePdf");
const {
  UserPrescriptionModel,
} = require("../../../models/Invoice/UserPrescription.model");
const { FrameModel } = require("../../../models/frame/Frame.model");
const LensModel = require("../../../models/lens/Lens.model");
const { FrameColor } = require("../../../models/frame/FrameColor.model");
const { createPDF } = require("../../../utils/createOrderLensDailyPdf");
const path = require("path");
const { promises } = require("node:fs");
const { LensCategory } = require("../../../models/lens/LensCategory.model");
const { LensGroup } = require("../../../models/lens/LensGroup.model");
const { LensType } = require("../../../models/lens/LensType.model");
const {
  RefractiveIndex,
} = require("../../../models/lens/RefractiveIndex.model");
const { FrameImages } = require("../../../models/frame/FrameImage.model");
const { FrameType } = require("../../../models/frame/FrameType.model");
const { FrameGender } = require("../../../models/frame/FrameGender.model");
const { FrameCategory } = require("../../../models/frame/FramCategory.model");

class CustomersController extends Controller {
  async createNewInvoice(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let {
        InsuranceAmount,
        employeeId,
        SumTotalInvoice,
        billBalance,
        deposit,
        description,
        descriptionPrice,
        discount,
        fullName,
        insuranceName,
        invoiceNumber,
        nationalId,
        orderLensFrom,
        paymentMethod,
        paymentToAccount,
        phoneNumber,
        prescriptions,
        gender,
      } = await createNewPurchaseInvoiceSchema.validateAsync(req.body);
      insuranceName = insuranceName === "" ? null : insuranceName;
      orderLensFrom = orderLensFrom === "" ? null : orderLensFrom;
      paymentToAccount = paymentToAccount === "" ? null : paymentToAccount;
      const cleanedNationalId = nationalId === "" ? null : nationalId;

      let user = await UserModel.findOne({
        where: {
          [Op.or]: [{ phoneNumber }, fullName ? { fullName } : null].filter(
            Boolean,
          ),
        },
      });

      if (user) {
        const updatedFields = {};

        if (!user.fullName && fullName) updatedFields.fullName = fullName;
        if (!user.gender && gender) updatedFields.gender = gender;
        if (!user.nationalId && cleanedNationalId)
          updatedFields.nationalId = cleanedNationalId;

        if (Object.keys(updatedFields).length > 0) {
          await user.update(updatedFields, { transaction });
        }
      } else {
        user = await UserModel.create(
          {
            fullName,
            phoneNumber,
            gender,
            nationalId: cleanedNationalId,
          },
          { transaction },
        );
      }

      const newInvoice = await InvoiceModel.create(
        {
          insuranceName,
          invoiceNumber,
          orderLensFrom,
          paymentToAccount,
          SumTotalInvoice: farsiDigitToEnglish(SumTotalInvoice || 0) || 0,
          userId: user.id,
          employeeId,
        },
        { transaction },
      );
      if (prescriptions && prescriptions.length > 0) {
        for (const prescription of prescriptions) {
          const frameColor = await FrameColor.findOne({
            where: {
              colorCode: prescription.frame?.FrameColors?.[0]?.colorCode,
              FrameModelFrameId: prescription.frame?.frameId,
            },
          });
          console.log("frameColor", frameColor);
          if (!frameColor) {
            throw CreateError.NotFound("رنگ انتخابی برای این فریم یافت نشد.");
          }

          if (frameColor.count <= 0) {
            throw CreateError.BadRequest("موجودی این رنگ فریم تمام شده است.");
          }

          await UserPrescriptionModel.create(
            {
              ...prescription,
              frameId: prescription.frame?.frameId,
              lensId: prescription.lens.lensId,
              frameColorCode: prescription.frame?.FrameColors?.[0]?.colorCode,
              InvoiceId: newInvoice.InvoiceId,
            },
            { transaction },
          );

          await frameColor.update(
            { count: frameColor.count - 1 },
            { transaction },
          );
        }
      }

      const formatedSumTotalInvoice = farsiDigitToEnglish(SumTotalInvoice || 0);
      const formatedInsuranceAmount = farsiDigitToEnglish(billBalance) || 0;

      if (paymentMethod) {
        await PaymentInfoModel.create(
          {
            InvoiceId: newInvoice.InvoiceId,
            paymentMethod,
            insuranceAmount: InsuranceAmount.replace(/[^\d.-]/g, "") || 0,
            SumTotalInvoice: formatedSumTotalInvoice,
            billBalance: formatedInsuranceAmount,
            discount: discount.replace(/[^\d.-]/g, "") || 0,
            deposit: deposit.replace(/[^\d.-]/g, "") || 0,
            descriptionPrice: descriptionPrice.replace(/[^\d.-]/g, "") || 0,
            paymentToAccount,
            description,
          },
          { transaction },
        );
      }

      await transaction.commit();

      const fullUserData = await UserModel.findOne({
        where: { id: user.id },
        include: [
          {
            model: InvoiceModel,
            as: "customerInvoices",
            where: { InvoiceId: newInvoice.InvoiceId },
            include: [
              {
                model: CompanyModel,
                as: "company",
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
              {
                model: BankModel,
                as: "bank",
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
              {
                model: InsuranceModel,
                as: "insurance",
                attributes: {
                  exclude: [
                    "document",
                    "panelUserName",
                    "panelPassword",
                    "websiteLink",
                  ],
                },
              },
              {
                model: UserPrescriptionModel,
                as: "prescriptions",
                include: [
                  {
                    model: FrameModel,
                    as: "frame",
                  },
                  {
                    model: LensModel,
                    as: "lens",
                  },
                ],
                attributes: {
                  exclude: ["updatedAt", "InvoiceId"],
                },
              },
              {
                model: PaymentInfoModel,
                as: "paymentInfo",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "InvoiceId"],
                },
              },
            ],
            attributes: {
              exclude: [
                "orderLensFrom",
                "paymentToAccount",
                "insuranceName",
                "updatedAt",
                "userId",
              ],
            },
          },
        ],
        attributes: { exclude: ["jobTitle", "otp", "createdAt", "updatedAt"] },
      });

      const employee = await UserModel.findByPk(employeeId);

      const invoicePdf = await generateCustomerInvoicePdf(
        fullUserData,
        invoiceNumber,
        employee,
      );
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: "قبض با موفقیت ذخیره گردید",
        fullUserData,
        invoicePdf,
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      if (error.isJoi) {
        console.error("🔴 Joi validation error:", error.details);
      } else {
        console.error("❌ Other error:", error);
      }
      next(error);
    }
  }

  async getLastInvoiceNumber(req, res, next) {
    try {
      const lastInvoice = await InvoiceModel.findOne({
        attributes: ["invoiceNumber"],
        order: [["invoiceNumber", "DESC"]],
      });

      const lastInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber : 999;
      const newInvoiceNumber = lastInvoiceNumber + 1;

      res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        invoiceNumber: newInvoiceNumber,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendSmsThanksForThePurchase(req, res, next) {
    try {
      const { invoiceNumber, phoneNumber, gender, customerName } =
        await sendSmsThanksForThePurchaseSchema.validateAsync(req.body);
      const result = await smsThanksPurchase(
        phoneNumber,
        gender,
        invoiceNumber,
        customerName,
      );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "پیامک تشکر از خرید با موفقیت ارسال گردید",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async lensOrdersDaily(req, res, next) {
    try {
      const { date } = req.query;

      function convertPersianToEnglishDigits(input) {
        return input.replace(/[۰-۹]/g, (char) =>
          String.fromCharCode(char.charCodeAt(0) - 1728),
        );
      }

      let filterCondition;

      if (date) {
        const normalizedDate = convertPersianToEnglishDigits(date);
        const isJalali = /^1[34]\d{2}-\d{1,2}-\d{1,2}$/.test(normalizedDate);
        const gregorianDate = isJalali
          ? convertJalaliToGregorian(normalizedDate)
          : normalizedDate;

        filterCondition = Sequelize.literal(
          `DATE("customerInvoice"."createdAt") = '${gregorianDate}'`,
        );
      } else {
        filterCondition = Sequelize.literal(
          `DATE("customerInvoice"."createdAt") = CURRENT_DATE`,
        );
      }

      const invoices = await InvoiceModel.findAll({
        where: filterCondition,
        include: [
          {
            model: CompanyModel,
            as: "company",
            attributes: ["CompanyId", "companyName"],
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
              },
            ],
            attributes: {
              exclude: [
                "updatedAt",
                "lensId",
                "frameId",
                "createdAt",
                "PrescriptionId",
              ],
            },
          },
        ],
        attributes: {
          exclude: [
            "insuranceName",
            "orderLensFrom",
            "paymentToAccount",
            "updatedAt",
            "userId",
            "SumTotalInvoice",
          ],
        },
      });

      return res.status(200).send({
        statusCode: 200,
        lensOrdersDaily: invoices,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendLensOrder(req, res, next) {
    try {
      const { invoiceId, userId } = req.body;
      const { pdfPath, fileName } = await createPDF(invoiceId, userId);

      if (!pdfPath) {
        throw new Error("مسیر فایل PDF یافت نشد");
      }

      await sendPDFToTelegramGroup(pdfPath, invoiceId);

      await promises.unlink(
        path.join(__dirname, "../../../", "public/orderLensDaily/", fileName),
      );

      res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "سفارش عدسی به شرکت مورد نظر ارسال شد و فایل PDF حذف شد.",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getAllInvoicesPaginated(req, res, next) {
    try {
      const { page = 1, size = 30, search = "" } = req.query;
      const limit = +size;
      const offset = (page - 1) * limit;
      const searchCondition = search.trim()
        ? {
            [Op.or]: [
              Sequelize.where(
                Sequelize.cast(
                  Sequelize.col("customerInvoice.invoiceNumber"),
                  "TEXT",
                ),
                { [Op.iLike]: `%${search}%` },
              ),
              { "$customer.fullName$": { [Op.iLike]: `%${search}%` } },
              {
                "$prescriptions.lens.lensName$": { [Op.iLike]: `%${search}%` },
              },
              { "$prescriptions.frame.name$": { [Op.iLike]: `%${search}%` } },
              Sequelize.where(
                Sequelize.cast(
                  Sequelize.col("customerInvoice.SumTotalInvoice"),
                  "TEXT",
                ),
                { [Op.iLike]: `%${search}%` },
              ),
            ],
          }
        : {};

      const { rows: invoices, count: total } =
        await InvoiceModel.findAndCountAll({
          where: searchCondition,
          offset,
          limit,
          order: [["createdAt", "DESC"]],
          include: [
            { model: CompanyModel, as: "company" },
            { model: BankModel, as: "bank" },
            { model: InsuranceModel, as: "insurance" },
            { model: PaymentInfoModel, as: "paymentInfo" },
            { model: UserModel, as: "customer" },
            { model: UserModel, as: "employee" },
            {
              model: UserPrescriptionModel,
              as: "prescriptions",
              include: [
                {
                  model: FrameModel,
                  as: "frame",
                  include: [
                    { model: FrameCategory },
                    { model: FrameGender },
                    { model: FrameType },
                    {
                      model: FrameColor,
                      include: [{ model: FrameImages }],
                    },
                  ],
                },
                {
                  model: LensModel,
                  as: "lens",
                  include: [
                    { model: LensCategory },
                    { model: LensGroup },
                    { model: LensType },
                    { model: RefractiveIndex },
                  ],
                },
              ],
            },
          ],
        });

      return res.status(200).json({
        statusCode: 200,
        invoices,
        pagination: {
          total,
          page: +page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching paginated invoices with search:", error);
      next(error);
    }
  }

  async sendToWorkshop(req, res, next) {
    try {
      const { invoiceId, userId } = req.body;

      if (!invoiceId && userId) {
        return res.status(400).send({
          statusCode: 400,
          message: "شناسه فاکتور اجباری است.",
        });
      }

      const invoice = await InvoiceModel.findByPk(invoiceId);

      if (!invoice) {
        return res.status(404).send({
          statusCode: 404,
          message: "فاکتور یافت نشد.",
        });
      }
      const registeredUser = await UserModel.findByPk(userId);
      invoice.lensOrderStatus = "workShopSection";
      invoice.workShopSectionBy = registeredUser.fullName;
      invoice.workShopSectionAt = new Date();

      await invoice.save();

      return res.status(200).send({
        statusCode: 200,
        message: "تحویل به کارگاه با موفقیت ثبت شد.",
        invoice,
      });
    } catch (e) {
      next(e);
    }
  }

  async sendToDeliver(req, res, next) {
    try {
      const { invoiceId, userId } = req.body;

      if (!invoiceId && userId) {
        return res.status(400).send({
          statusCode: 400,
          message: "شناسه فاکتور اجباری است.",
        });
      }
      const registeredUser = await UserModel.findByPk(userId);
      const invoice = await InvoiceModel.findByPk(invoiceId);

      if (!invoice) {
        return res.status(404).send({
          statusCode: 404,
          message: "فاکتور یافت نشد.",
        });
      }

      invoice.lensOrderStatus = "readyToDeliver";
      invoice.readyToDeliverBy = registeredUser.fullName;
      invoice.readyToDeliverAt = new Date();

      await invoice.save();

      return res.status(200).send({
        statusCode: 200,
        message: "عینک با موفقیت به بخش بسته بندی تحویل داده شد",
        invoice,
      });
    } catch (e) {
      next(e);
    }
  }

  async sendDeliverySms(req, res, next) {
    try {
      const { invoiceId, userId } = req.body;

      if (!invoiceId && userId) {
        return res.status(400).send({
          statusCode: 400,
          message: "شناسه فاکتور اجباری است.",
        });
      }
      const registeredUser = await UserModel.findByPk(userId);
      const invoice = await InvoiceModel.findByPk(invoiceId, {
        include: [
          {
            model: UserModel,
            as: "customer",
            attributes: ["fullName", "gender"],
          },
        ],
      });

      if (!invoice) {
        return res.status(404).send({
          statusCode: 404,
          message: "فاکتور یافت نشد.",
        });
      }
      const { customer } = invoice;
      const result = await orderDeliverySms(
        customer.phoneNumber,
        customer.gender,
        invoice.InvoiceId,
        customer.fullName,
        `${registeredUser.gender} ${registeredUser.fullName}`,
      );
      console.log(result);
      if (!result.success) {
        throw CreateError.NotFound("پیامک آماده شد سفارش ارسال نشد ");
      }
      invoice.lensOrderStatus = "sendOrderSms";
      invoice.sendOrderSmsBy = registeredUser.fullName;
      invoice.sendOrderSmsAt = new Date();

      await invoice.save();
      return res.status(200).send({
        statusCode: 200,
        message: "عینک با موفقیت به بخش تحویل ارجاع داده شد",
        invoice,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  CustomersController: new CustomersController(),
};
