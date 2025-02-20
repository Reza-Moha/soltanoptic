const Controller = require("../../Controller");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  createNewPurchaseInvoiceSchema,
  sendSmsThanksForThePurchaseSchema,
} = require("../../../validation/admin/admin.schema");
const { UserModel } = require("../../../models/User.model");
const { Op } = require("sequelize");
const { sequelize } = require("../../../libs/DBConfig");
const { InvoiceModel } = require("../../../models/Invoice/Invoice.model");
const {
  UserPrescriptionModel,
} = require("../../../models/Invoice/MedicalPrescription.model");
const {
  PaymentInfoModel,
} = require("../../../models/Invoice/PaymentInfo.model");
const { farsiDigitToEnglish, smsThanksPurchase } = require("../../../utils");
const { CompanyModel } = require("../../../models/Company.model");
const { BankModel } = require("../../../models/Bank.model");
const { InsuranceModel } = require("../../../models/Insurance.model");

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

      // Check for invalid admin phone number
      // if (phoneNumber === process.env.ADMIN_PHONENUMBER)
      //   throw CreateError.BadRequest("شماره موبایل وارد شده نامعتبر است");

      // Find the user by fullName or phoneNumber
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
          await UserPrescriptionModel.create(
            {
              ...prescription,
              InvoiceId: newInvoice.InvoiceId,
            },
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
            include: [
              {
                model: CompanyModel,
                as: "company",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
              {
                model: BankModel,
                as: "bank",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
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
                attributes: {
                  exclude: ["createdAt", "updatedAt", "InvoiceId"],
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
                "createdAt",
                "updatedAt",
                "userId",
              ],
            },
          },
        ],
        attributes: {
          exclude: ["jobTitle", "otp", "createdAt", "updatedAt"],
        },
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: "قبض با موفقیت ذخیره گردید",
        fullUserData,
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
}

module.exports = {
  CustomersController: new CustomersController(),
};
