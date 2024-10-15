const { FrameCategory } = require("../../../models/frame/FramCategory.model");
const { FrameType } = require("../../../models/frame/FrameType.model");
const { FrameGender } = require("../../../models/frame/FrameGender.model");
const {
  createFrameCategorySchema,
  idSchema,
  createFrameGenderSchema,
} = require("../../../validation/admin/admin.schema");
const Controller = require("../../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
class FrameController extends Controller {
  async createFrameCategory(req, res, next) {
    try {
      const { title, description } =
        await createFrameCategorySchema.validateAsync(req.body);

      const exsitFrameCategoty = await FrameCategory.findOne({
        where: { title },
      });
      if (exsitFrameCategoty)
        throw CreateError.BadRequest(
          "دسته بندی با این مشخصات قبلا ثبت شده است"
        );
      const newFrameCategory = await FrameCategory.create({
        title,
        description,
      });
      if (!newFrameCategory)
        throw CreateError.InternalServerError(
          "خطا در ایجاد دسته بندی لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "دسته بندی با موفقیت ذخیره شد",
        newFrameCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFrameCategory(req, res, next) {
    try {
      const allFrameCategories = await FrameCategory.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allFrameCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFrameCategory(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const result = await FrameCategory.findByPk(id);
      if (!result)
        throw CreateError.NotFound("دسته بندی فریم با این مشخصات وجود ندارد");
      const deleteCount = await result.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف دسته بندی موفقیت آمیز نبود لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "دسته بندی فریم با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async createFrameType(req, res, next) {
    try {
      const { title, description } =
        await createFrameCategorySchema.validateAsync(req.body);

      const exsitFrameType = await FrameType.findOne({
        where: { title },
      });
      if (exsitFrameType)
        throw CreateError.BadRequest("نوع فریم با این مشخصات قبلا ثبت شده است");
      const newFrameType = await FrameType.create({
        title,
        description,
      });
      if (!newFrameType)
        throw CreateError.InternalServerError(
          "خطا در ایجاد نوع فریم لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "نوع فریم با موفقیت ذخیره شد",
        newFrameType,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFrameType(req, res, next) {
    try {
      const allFrameType = await FrameType.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allFrameType,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFrameType(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const result = await FrameType.findByPk(id);
      if (!result)
        throw CreateError.NotFound("نوع فریم با این مشخصات وجود ندارد");
      const deleteCount = await result.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف نوع فریم موفقیت آمیز نبود لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "نوع فریم با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async createFrameGender(req, res, next) {
    try {
      const { gender, description } =
        await createFrameGenderSchema.validateAsync(req.body);

      const exsitFrameGender = await FrameGender.findOne({
        where: { gender },
      });
      if (exsitFrameGender)
        throw CreateError.BadRequest(
          "جنسیت فریم با این مشخصات قبلا ثبت شده است"
        );
      const newFrameGender = await FrameGender.create({
        gender,
        description,
      });
      if (!newFrameGender)
        throw CreateError.InternalServerError(
          "خطا در ایجاد جنسیت فریم لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "جنسیت فریم با موفقیت ذخیره شد",
        newFrameGender,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFrameGender(req, res, next) {
    try {
      const allFrameGender = await FrameGender.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allFrameGender,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFrameGender(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const result = await FrameGender.findByPk(id);
      if (!result)
        throw CreateError.NotFound("جنسیت فریم با این مشخصات وجود ندارد");
      const deleteCount = await result.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف جنسیت فریم موفقیت آمیز نبود لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "جنسیت فریم با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  FrameController: new FrameController(),
};
