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
        // Case: If the user doesn't exist and both fullName and gender are null
        if (fullName === null && gender === null) {
          // Try to find user by phoneNumber only (without fullName and gender)
          user = await UserModel.findOne({
            where: { phoneNumber },
          });

          if (user) {
            // If the user exists, update with new phoneNumber and nationalId but skip updating null fullName/gender
            user = await user.update(
              {
                nationalId, // Update nationalId if it exists
                phoneNumber, // Update phoneNumber if necessary
              },
              { transaction },
            );
          } else {
            // If no user is found, create a new one without fullName and gender
            user = await UserModel.create(
              { phoneNumber, nationalId }, // Create without fullName and gender
              { transaction },
            );
          }
        } else {
          // Case: Create new user with fullName and gender provided
          user = await UserModel.create(
            { fullName, phoneNumber, nationalId, gender },
            { transaction },
          );
        }
      } else {
        // Case: User exists, handle possible null fullName or gender updates
        if (fullName && gender) {
          // Only update fullName and gender if both are provided
          await user.update({ fullName, gender }, { transaction });
        }
      }

      // Create the invoice
      const newInvoice = await InvoiceModel.create(
        {
          insuranceName,
          invoiceNumber,
          orderLensFrom,
          paymentToAccount,
          SumTotalInvoice: farsiDigitToEnglish(SumTotalInvoice || 0) || 0,
          userId: user.id,
        },
        { transaction },
      );

      // Handle prescriptions (if any)
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

      // Process payment information
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

      // Commit transaction
      await transaction.commit();

      // Fetch and return the full user data
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
      // Rollback transaction if something goes wrong
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
