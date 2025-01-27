const Controller = require("../../Controller");
const {
  createNewBankSchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");
const { BankModel } = require("../../../models/Bank.model");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
class CompanyController extends Controller {
  async createNewCompany(req, res, next) {
    try {
      const { companyName, whatsappNumber } =
        await createNewCompanySchema.validateAsync(req.body);
      const existCartNumber = await BankModel.findOne({
        where: { cartNumber },
      });
      if (existCartNumber)
        throw CreateError.BadRequest("شماره کارت وارد شده تکراری است");

      const createdBank = await BankModel.create({
        bankName,
        bankAccountHolder,
        shabaNumber,
        cartNumber,
      });
      if (!createdBank)
        throw CreateError.InternalServerError(
          "ذخیره اطلاعات بانک ناموفق بود لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "اطلاعات بانک وارد شده با موفقیت ثبت گردید",
        createdBank,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBanks(req, res, next) {
    try {
      const allBanks = await BankModel.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allBanks,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBankById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const deletedBank = await BankModel.destroy({
        where: { BankId: id },
      });
      if (deletedBank <= 0)
        throw CreateError.InternalServerError(
          "حذف بانک ناموفق بود لطفا دوباره  امتحان کنید",
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "عملیات حذف با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  BankController: new CompanyController(),
};
