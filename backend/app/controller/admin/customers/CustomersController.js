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
} = require("../../../models/Invoice/PaymentInfoModel");

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
      } = await createNewPurchaseInvoiceSchema.validateSync(req.body);

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
          InsuranceAmount,
          SumTotalInvoice,
          billBalance,
          deposit,
          description,
          descriptionPrice,
          discount,
          insuranceName,
          invoiceNumber,
          orderLensFrom,
          paymentMethod,
          paymentToAccount,
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

      if (paymentMethod && paymentToAccount) {
        await PaymentInfoModel.create(
          {
            InvoiceId: newInvoice.InvoiceId,
            PaymentMethod: paymentMethod,
            PaymentAmount: deposit,
            BillBalance: billBalance,
          },
          { transaction },
        );
      }

      await transaction.commit();

      return res.status(201).json({
        success: true,
        message: "قبض با موفقیت ذخیره گردید",
        data: {
          invoice: newInvoice,
          prescriptions,
        },
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = {
  CustomersController: new CustomersController(),
};
