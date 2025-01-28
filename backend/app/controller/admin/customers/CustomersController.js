const Controller = require("../../Controller");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  createNewPurchaseInvoiceSchema,
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
const { farsiDigitToEnglish } = require("../../../utils");
const { CompanyModel } = require("../../../models/Company.model");
const { BankModel } = require("../../../models/Bank.model");
const { InsuranceModel } = require("../../../models/Insurance.model");

class CustomersController extends Controller {
  async createNewInvoice(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const {
        InsuranceAmount,
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
      } = await createNewPurchaseInvoiceSchema.validateAsync(req.body);
      if (phoneNumber === process.env.ADMIN_PHONENUMBER)
        throw CreateError.BadRequest("شماره موبایل وارد شده نامعتبر است");
      let user = await UserModel.findOne({
        where: {
          [Op.or]: [{ fullName }, { phoneNumber }],
        },
      });

      if (!user) {
        user = await UserModel.create(
          { fullName, phoneNumber, nationalId },
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
          description: description || null,
          userId: user.id,
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
}

module.exports = {
  CustomersController: new CustomersController(),
};
