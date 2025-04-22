const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const Controller = require("../../Controller");
const {
  createNewRefractiveIndexSchema,
  idSchema,
  createNewLensTypeSchema,
  createNewLensCategorySchema,
  createNewLensSchema,
  pricingLensSchema,
} = require("../../../validation/admin/admin.schema");
const {
  RefractiveIndex,
} = require("../../../models/lens/RefractiveIndex.model");
const { LensType } = require("../../../models/lens/LensType.model");
const path = require("path");
const { LensCategory } = require("../../../models/lens/LensCategory.model");
const LensModel = require("../../../models/lens/Lens.model");
const { deleteFileInPublic } = require("../../../utils");
const { LensGroup } = require("../../../models/lens/LensGroup.model");
const { Sequelize, Op } = require("sequelize");
const {
  LensOrderStatusTracking,
} = require("../../../models/Invoice/LensOrderStatusTracking.model");
class LensController extends Controller {
  async createNewLens(req, res, next) {
    try {
      const {
        lensName,
        description,
        LensCategoryId,
        RefractiveIndexId,
        LensTypeId,
        fileUploadPath,
        filename,
      } = await createNewLensSchema.validateAsync(req.body);
      const lensImage = path.join(fileUploadPath, filename).replace(/\\/g, "/");
      const exsistLens = await LensModel.findOne({
        where: {
          lensName,
          LensCategoryId,
        },
      });
      if (exsistLens)
        throw CreateError.BadRequest("عدسی با این مشخصات قبلا ثبت شده است");
      await LensModel.sync({ alter: true });
      await LensOrderStatusTracking.sync({ alter: true });

      const trackingInstance = await LensOrderStatusTracking.create({});
      const createdNewLens = await LensModel.create({
        lensImage,
        lensName,
        description,
        LensCategoryId,
        RefractiveIndexId,
        LensTypeId,
        lensOrderStatusTrackingId: trackingInstance.id,
      });
      if (!createdNewLens)
        throw CreateError.InternalServerError(
          "در ایجاد عدسی جدید با خطا روبرو شد لظفا دوباره امتحان کنید",
        );
      const newLensWithRelations = await LensModel.findByPk(
        createdNewLens.lensId,
        {
          include: [
            { model: LensType },
            { model: RefractiveIndex },
            {
              model: LensCategory,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            { model: LensOrderStatusTracking },
          ],
          attributes: {
            exclude: ["lensCategoryId", "RefractiveIndexId", "LensTypeId"],
          },
        },
      );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "عدسی با موفقیت به انبار اضافه شد",
        createdNewLens: newLensWithRelations,
      });
    } catch (error) {
      const { fileUploadPath, filename } = req.body;
      if (fileUploadPath && filename) {
        const image = path.join(fileUploadPath, filename).replace(/\\/g, "/");
        deleteFileInPublic(image);
      }
      next(error);
    }
  }

  async getAllLens(req, res, next) {
    try {
      const { page = 1, size = 10, search = "" } = req.query;

      const limit = parseInt(size, 10);
      const offset = (page - 1) * limit;

      const whereCondition = search
        ? {
            lensName: {
              [Sequelize.Op.like]: `%${search.toLowerCase()}%`,
            },
          }
        : {};

      const includeCondition = [
        {
          model: LensType,
        },
        {
          model: RefractiveIndex,
        },
        {
          model: LensCategory,
        },
        {
          model: LensGroup,
        },
      ];

      const allLens = await LensModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: includeCondition,
        attributes: {
          exclude: [
            "LensCategoryId",
            "RefractiveIndexId",
            "LensTypeId",
            "LensGroupId",
          ],
        },
      });

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allLens: allLens.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allLens.count / limit),
          totalItems: allLens.count,
          size,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLensById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const lens = await LensModel.findByPk(id);
      if (!lens) throw CreateError.NotFound("عدسی با این مشخصات وجود ندارد");
      const deleteCount = await lens.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف عدسی با خظا مواجه شد لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "عدسی با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async pricingLens(req, res, next) {
    try {
      const { LensCategoryId, LensId, pricing } =
        await pricingLensSchema.validateAsync(req.body);
      const newPricingLens = await LensGroup.create({
        pricing,
      });
      if (!newPricingLens)
        throw CreateError.InternalServerError(
          "قیمت گذاری عدسی با مشکل مواجه شد لظفا دوباره امتحان کنید",
        );
      const [updatedRowCount, updatedRows] = await LensModel.update(
        {
          LensGroupId: newPricingLens.id,
        },
        {
          where: {
            LensCategoryId,
            lensId: LensId,
          },
          returning: true,
        },
      );

      if (updatedRowCount === 0) {
        throw CreateError.NotFound("رکوردی با این اطلاعات پیدا نشد");
      }
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "قیمت گذاری عدسی با موفقیت انجام شد",
        LensData: updatedRows,
      });
    } catch (error) {
      next(error);
    }
  }

  async createNewRefractiveIndex(req, res, next) {
    try {
      await createNewRefractiveIndexSchema.validateAsync(req.body);
      const { index, characteristics } = req.body;
      const exsitReflactiveIndex = await RefractiveIndex.findOne({
        where: { index },
      });
      if (exsitReflactiveIndex)
        throw CreateError.BadRequest(
          "ضریب شکست با این مشخصات قبلا ثبت شده است",
        );
      const newIndex = await RefractiveIndex.create({
        index,
        characteristics,
      });
      if (!newIndex)
        throw CreateError.InternalServerError(
          "خطا در ایجاد ضریب شکست لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "ضریب شکت با موفقیت ذخیره شد",
        newIndex,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRefractiveIndex(req, res, next) {
    try {
      const allRefractiveIndex = await RefractiveIndex.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allRefractiveIndex,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRefractiveIndexById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const refractiveIndex = await RefractiveIndex.findByPk(id);
      if (!refractiveIndex)
        throw CreateError.NotFound("ضریب شکست با این مشخصات وجود ندارد");
      const deletedCount = await RefractiveIndex.destroy({ where: { id } });
      if (deletedCount === 0)
        throw CreateError.InternalServerError(
          "خطا در حذف ضریب شکست لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "ضریب شکست با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async createNewLensType(req, res, next) {
    try {
      const { title, description } =
        await createNewLensTypeSchema.validateAsync(req.body);

      const exsitLensType = await LensType.findOne({
        where: { title },
      });
      if (exsitLensType)
        throw CreateError.BadRequest("نوع عدسی با این مشخصات قبلا ثبت شده است");
      const newLensType = await LensType.create({
        title,
        description,
      });
      if (!newLensType)
        throw CreateError.InternalServerError(
          "خطا در ایجاد نوع عدسی لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "نوع عدسی با موفقیت ذخیره شد",
        newLensType,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllLensType(req, res, next) {
    try {
      const allLensType = await LensType.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allLensType,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLensTypeById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const result = await LensType.findByPk(id);
      if (!result)
        throw CreateError.NotFound("نوع عدسی با این مشخصات وجود ندارد");
      const deleteCount = await result.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف نوع عدسی با مشکل مواجه شد لظفا دوباره امتحان کنید ",
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "ضریب شکست با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async createNewLensCategory(req, res, next) {
    try {
      const { lensName, fileUploadPath, filename } =
        await createNewLensCategorySchema.validateAsync(req.body);
      const lensImage = path.join(fileUploadPath, filename).replace(/\\/g, "/");
      const exsistLensCategory = await LensCategory.findOne({
        where: { lensCategoryName: lensName },
      });
      if (exsistLensCategory)
        throw CreateError.BadRequest(
          "دسته بندی با این مشخصات قبلا ثبت شده است",
        );
      const newLensCategory = await LensCategory.create({
        lensCategoryName: lensName,
        lensImage,
      });
      if (!newLensCategory)
        throw CreateError.InternalServerError(
          "خطا در ایجاد دسته بندی لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "دسته بندی با موفقیت ذخیره شد",
        newLensCategory,
      });
    } catch (error) {
      const { fileUploadPath, filename } = req.body;
      const image = path.join(fileUploadPath, filename).replace(/\\/g, "/");
      deleteFileInPublic(image);
      next(error);
    }
  }

  async deleteLensCategoryById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const result = await LensCategory.findByPk(id);
      if (!result)
        throw CreateError.NotFound("دسته بندی عدسی با این مشخصات وجود ندارد");
      const deleteCount = await result.destroy({ where: { id } });
      if (deleteCount === 0)
        throw CreateError.InternalServerError(
          "حذف دسته بندی موفقیت آمیز نبود لطفا دوباره امتحان کنید",
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "دسته بندی با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllLensCategories(req, res, next) {
    try {
      const allLensCategories = await LensCategory.findAll({});
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allLensCategories,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  LensController: new LensController(),
};
