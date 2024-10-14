const { FrameCategory } = require("../../../models/frame/FramCategory.model");
const {
  createFrameCategorySchema,
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
}

module.exports = {
  FrameController: new FrameController(),
};
