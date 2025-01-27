const Controller = require("../../Controller");
const {
  createNewCompanySchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");
const CreateError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { Op } = require("sequelize");
const { CompanyModel } = require("../../../models/Company.model");
class CompanyController extends Controller {
  async createNewCompany(req, res, next) {
    try {
      const { companyName, whatsappNumber } =
        await createNewCompanySchema.validateAsync(req.body);
      const exsistCompany = await CompanyModel.findOne({
        where: {
          [Op.or]: [{ companyName }, { whatsappNumber }],
        },
      });

      if (exsistCompany)
        throw CreateError.BadRequest("شرکت وارد شده تکراری است");

      const createdCompany = await CompanyModel.create({
        companyName,
        whatsappNumber,
      });
      if (!createdCompany)
        throw CreateError.InternalServerError(
          "ذخیره اطلاعات شرکت ناموفق بود لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "شرکت وارد شده با موفقیت ثبت گردید",
        createdCompany,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCompanies(req, res, next) {
    try {
      const allCompanies = await CompanyModel.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allCompanies,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompanyById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const deletedCompany = await CompanyModel.destroy({
        where: { CompanyId: id },
      });
      if (deletedCompany <= 0)
        throw CreateError.InternalServerError(
          "حذف شرکت ناموفق بود لطفا دوباره  امتحان کنید",
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
  CompanyController: new CompanyController(),
};
