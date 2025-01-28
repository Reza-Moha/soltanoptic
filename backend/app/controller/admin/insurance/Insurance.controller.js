const Controller = require("../../Controller");
const {
  createNewInsuranceSchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");
const { InsuranceModel } = require("../../../models/Insurance.model");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const { BankModel } = require("../../../models/Bank.model");

class InsuranceController extends Controller {
  async createInsurance(req, res, next) {
    try {
      const {
        insuranceName,
        insuranceFranchise,
        panelUserName,
        websiteLink,
        panelPassword,
        description,
        documents,
      } = await createNewInsuranceSchema.validateAsync(req.body);
      const existingInsurance = await InsuranceModel.findOne({
        where: { insuranceName },
      });
      if (existingInsurance)
        throw CreateError.BadRequest("بیمه با این مشخصات قبلا ثبت شده است");
      const createdInsurance = await InsuranceModel.create({
        insuranceName,
        insuranceFranchise,
        panelUserName,
        websiteLink,
        panelPassword,
        description,
        documents,
      });
      if (!createdInsurance)
        throw CreateError.InternalServerError(
          "ذخیره اطلاعات بیمه ناموفق بود لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "اطلاعات بیمه وارد شده با موفقیت ثبت گردید",
        createdInsurance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllInsurance(req, res, next) {
    try {
      const allInsurance = await InsuranceModel.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allInsurance,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInsuranceById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const deletedInsurance = await InsuranceModel.destroy({
        where: { id },
      });
      if (deletedInsurance <= 0)
        throw CreateError.InternalServerError(
          "حذف بیمه ناموفق بود لطفا دوباره  امتحان کنید",
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
  InsuranceController: new InsuranceController(),
};
