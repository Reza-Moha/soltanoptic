const Controller = require("../../Controller");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  createNewPurchaseInvoiceSchema,
  sendSmsThanksForThePurchaseSchema,
} = require("../../../validation/admin/admin.schema");
const { UserModel } = require("../../../models/User.model");
const { Op, literal, fn, where, col, Sequelize } = require("sequelize");
const { sequelize } = require("../../../libs/DBConfig");
const { InvoiceModel } = require("../../../models/Invoice/Invoice.model");
const {
  PaymentInfoModel,
} = require("../../../models/Invoice/PaymentInfo.model");
const { farsiDigitToEnglish, smsThanksPurchase } = require("../../../utils");
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

class CustomersController extends Controller {
  async createNewInvoice(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
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

      let user = await UserModel.findOne({
        where: {
          [Op.or]: [{ fullName }, { phoneNumber }],
        },
      });

      if (!user) {
        if (fullName === null && gender === null) {
          user = await UserModel.findOne({
            where: { phoneNumber },
          });

          if (user) {
            user = await user.update(
              {
                nationalId,
                phoneNumber,
              },
              { transaction },
            );
          } else {
            user = await UserModel.create(
              { phoneNumber, nationalId },
              { transaction },
            );
          }
        } else {
          user = await UserModel.create(
            { fullName, phoneNumber, nationalId, gender },
            { transaction },
          );
        }
      } else {
        if (fullName && gender) {
          await user.update({ fullName, gender, nationalId }, { transaction });
        }
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

      if (paymentMethod && paymentToAccount) {
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
      next(error);
    }
  }

  async getLastInvoiceNumber(req, res, next) {
    try {
      const lastInvoice = await InvoiceModel.findOne({
        attributes: ["invoiceNumber"],
        order: [["createdAt", "DESC"]],
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
      const invoices = await InvoiceModel.findAll({
        where: Sequelize.literal(
          `DATE("customerInvoice"."createdAt") = CURRENT_DATE`,
        ),
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
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        lensOrdersDaily: invoices,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  CustomersController: new CustomersController(),
};
