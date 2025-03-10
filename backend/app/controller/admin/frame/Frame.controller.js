const { FrameCategory } = require("../../../models/frame/FramCategory.model");
const { FrameType } = require("../../../models/frame/FrameType.model");
const { FrameGender } = require("../../../models/frame/FrameGender.model");
const { FrameColor } = require("../../../models/frame/FrameColor.model");
const { FrameImages } = require("../../../models/frame/FrameImage.model");
const { FrameModel } = require("../../../models/frame/Frame.model");
const {
  createFrameCategorySchema,
  idSchema,
  createFrameGenderSchema,
  createNewFrameSchema,
} = require("../../../validation/admin/admin.schema");
const Controller = require("../../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const { deleteFileInPublic } = require("../../../utils");
const path = require("path");
class FrameController extends Controller {
  async createNewFrame(req, res, next) {
    try {
      const {
        name,
        price,
        frameCategory,
        frameType,
        frameGender,
        serialNumber,
        description,
        colors,
        fileUploadPath,
      } = await createNewFrameSchema.validateAsync(req.body);

      const frame = await FrameModel.create({
        name,
        price,
        serialNumber,
        description,
        FrameCategoryId: frameCategory,
        FrameTypeId: frameType,
        FrameGenderId: frameGender,
      });
      console.log(frame);
      await Promise.all(
        colors.map(async (color) => {
          const createdColor = await FrameColor.create({
            colorCode: color.colorCode,
            count: parseInt(color.count),
            FrameModelFrameId: frame.frameId,
          });

          const colorFiles = req.files.filter(
            (file) =>
              file.originalname.split("-")[0].toLowerCase() ===
              color.colorCode.replace("#", "").toLowerCase(),
          );

          await Promise.all(
            colorFiles.map(async (file) => {
              const imageUrl = path
                .join(fileUploadPath, file.filename)
                .replace(/\\/g, "/");
              await FrameImages.create({
                imageUrl,
                FrameColorId: createdColor.id,
              });
            }),
          );
        }),
      );
      const newFrame = await FrameModel.findOne({
        where: { frameId: frame.frameId },
        include: [
          { model: FrameCategory, as: "FrameCategory" },
          { model: FrameType, as: "FrameType" },
          { model: FrameGender, as: "FrameGender" },
          {
            model: FrameColor,
            as: "FrameColors",
            include: [
              {
                model: FrameImages,
                as: "FrameImages",
              },
            ],
          },
        ],
      });
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "فریم با موفقیت به انبار اضافه شد",
        newFrame,
      });
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) =>
          deleteFileInPublic(path.join(req.body.fileUploadPath, file.filename)),
        );
      }
      next(error);
    }
  }

  async updateFrame(req, res, next) {
    try {
      const {
        id,
        name,
        price,
        frameCategory,
        frameType,
        frameGender,
        serialNumber,
        description,
        colors,
        fileUploadPath,
      } = await createNewFrameSchema.validateAsync(req.body);

      const frame = await FrameModel.findByPk(id);
      if (!frame) {
        return res.status(HttpStatus.NOT_FOUND).send({
          statusCode: HttpStatus.NOT_FOUND,
          message: "فریم یافت نشد",
        });
      }

      const existingColors = await FrameColor.findAll({
        where: { FrameModelId: frame.frameId },
      });
      for (const color of existingColors) {
        const images = await FrameImages.findAll({
          where: { FrameColorId: color.id },
        });
        for (const image of images) {
          deleteFileInPublic(path.join(image.imageUrl));
          await image.destroy();
        }
        await color.destroy();
      }

      await frame.update({
        name,
        price,
        serialNumber,
        description,
        FrameCategoryId: frameCategory,
        FrameTypeId: frameType,
        FrameGenderId: frameGender,
      });

      for (const color of colors) {
        const createdColor = await FrameColor.create({
          colorCode: color.colorCode,
          count: parseInt(color.count),
          FrameModelId: frame.frameId,
        });

        for (const file of req.files) {
          if (
            file.originalname.split("-")[0].toLowerCase() ===
            color.colorCode.replace("#", "").toLowerCase()
          ) {
            const imageUrl = path
              .join(fileUploadPath, file.filename)
              .replace(/\\/g, "/");
            await FrameImages.create({
              imageUrl,
              FrameColorId: createdColor.id,
            });
          }
        }
      }
      const updatedFrame = await FrameModel.findOne({
        where: { id: frame.frameId },
        include: [
          { model: FrameCategory, as: "FrameCategory" },
          { model: FrameType, as: "FrameType" },
          { model: FrameGender, as: "FrameGender" },
          {
            model: FrameColor,
            as: "FrameColors",
            include: [
              {
                model: FrameImages,
                as: "FrameImages",
              },
            ],
          },
        ],
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "فریم با موفقیت به‌روزرسانی شد",
        updatedFrame,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFrameById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;

      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");

      const frame = await FrameModel.findByPk(id, {
        include: [{ model: FrameColor, include: [FrameImages] }],
      });

      if (!frame) throw CreateError.NotFound("فریم با این مشخصات وجود ندارد");

      for (const color of frame.FrameColors) {
        for (const image of color.FrameImages) {
          if (!image.imageUrl) {
            console.error(`Missing imageUrl for image:`, image);
            continue;
          }

          const fullPath = path.join(__dirname, "../public", image.imageUrl);
          console.log("Deleting file:", fullPath);

          try {
            deleteFileInPublic(image.imageUrl);
          } catch (err) {
            console.error(`Error deleting file: ${fullPath}`, err);
          }
        }
      }

      await frame.destroy();

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "فریم با موفقیت حذف گردید",
      });
    } catch (error) {
      next(error);
    }
  }

  async getFrameById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");

      const frame = await FrameModel.findOne({
        where: { id },
        include: [
          { model: FrameCategory },
          { model: FrameType },
          { model: FrameGender },
          {
            model: FrameColor,
            include: [
              { model: FrameImages, attributes: { exclude: ["FrameColorId"] } },
            ],
            attributes: {
              exclude: ["FrameModelId"],
            },
          },
        ],
        attributes: {
          exclude: ["FrameCategoryId", "FrameGenderId", "FrameTypeId"],
        },
      });

      if (!frame) throw CreateError.NotFound("فریمی با این مشخصات وجود ندارد");

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        frame,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFrame(req, res, next) {
    try {
      // دریافت تمامی فریم‌ها همراه با اطلاعات مرتبط
      const frames = await FrameModel.findAll({
        include: [
          { model: FrameCategory },
          { model: FrameType },
          { model: FrameGender },
          {
            model: FrameColor,
            include: [
              { model: FrameImages, attributes: { exclude: ["FrameColorId"] } },
            ],
            attributes: {
              exclude: ["FrameModelId"],
            },
          },
        ],
        attributes: {
          exclude: ["FrameCategoryId", "FrameGenderId", "FrameTypeId"],
        },
      });

      // محاسبه مجموع کل تعداد فریم‌ها از جدول FrameColor
      const totalColorCount = await FrameColor.sum("count");

      let totalInventoryValue = 0;
      let frameTypeCount = {};
      let genderCount = {};

      // محاسبه سایر داده‌ها
      frames.forEach((frame) => {
        const frameType = frame.FrameType.title;
        if (!frameTypeCount[frameType]) {
          frameTypeCount[frameType] = 0;
        }
        frameTypeCount[frameType] += 1;

        const gender = frame.FrameGender.gender;
        if (!genderCount[gender]) {
          genderCount[gender] = 0;
        }
        genderCount[gender] += 1;

        frame.FrameColors.forEach((color) => {
          const framePrice = parseFloat(frame.price.replace(/,/g, ""));
          const colorQuantity = parseInt(color.count, 10);

          if (!isNaN(framePrice) && !isNaN(colorQuantity)) {
            const colorValue = framePrice * colorQuantity;
            totalInventoryValue += colorValue;
          } else {
            console.warn(
              `Invalid data for frame: ${frame.frameId}, price: ${frame.price}, count: ${color.count}`,
            );
          }
        });
      });

      const frameTypeArray = Object.keys(frameTypeCount).map((type) => ({
        frameType: type,
        count: frameTypeCount[type],
      }));

      const genderArray = Object.keys(genderCount).map((gender) => ({
        gender: gender,
        count: genderCount[gender],
      }));

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        frames,
        totalInventoryValue,
        totalColorCount, // مقدار مجموع تعداد فریم‌ها
        frameTypeArray,
        genderArray,
      });
    } catch (error) {
      next(error);
    }
  }

  async createFrameCategory(req, res, next) {
    try {
      const { title, description } =
        await createFrameCategorySchema.validateAsync(req.body);

      const exsitFrameCategoty = await FrameCategory.findOne({
        where: { title },
      });
      if (exsitFrameCategoty)
        throw CreateError.BadRequest(
          "دسته بندی با این مشخصات قبلا ثبت شده است",
        );
      const newFrameCategory = await FrameCategory.create({
        title,
        description,
      });
      if (!newFrameCategory)
        throw CreateError.InternalServerError(
          "خطا در ایجاد دسته بندی لطفا دوباره امتحان کنید",
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
          "حذف دسته بندی موفقیت آمیز نبود لطفا دوباره امتحان کنید",
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
          "خطا در ایجاد نوع فریم لطفا دوباره امتحان کنید",
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
          "حذف نوع فریم موفقیت آمیز نبود لطفا دوباره امتحان کنید",
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
          "جنسیت فریم با این مشخصات قبلا ثبت شده است",
        );
      const newFrameGender = await FrameGender.create({
        gender,
        description,
      });
      if (!newFrameGender)
        throw CreateError.InternalServerError(
          "خطا در ایجاد جنسیت فریم لطفا دوباره امتحان کنید",
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
          "حذف جنسیت فریم موفقیت آمیز نبود لطفا دوباره امتحان کنید",
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
