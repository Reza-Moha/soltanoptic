const { BlackListFields } = require("../../constants");
const { UserModel } = require("../../models/User.model");
const {
  deleteInvalidPropertyInObject,
  deleteFileInPublic,
} = require("../../utils");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  updateAdminProfileSchema,
} = require("../../validation/admin/admin.schema");
const Controller = require("../Controller");
const path = require("path");
const CreateError = require("http-errors");

class AdminController extends Controller {
  async updateAdminProfile(req, res, next) {
    try {
      await updateAdminProfileSchema.validateAsync(req.body);

      const { fileUploadPath, filename, phoneNumber, fullName } = req.body;
      const image = path.join(fileUploadPath, filename).replace(/\\/g, "/");

      deleteInvalidPropertyInObject(req.body, BlackListFields);
      const id = req.user.id;

      const [updatedRowsCount] = await UserModel.update(
        { fullName, phoneNumber, profileImage: image },
        {
          where: { id },
          returning: true,
        }
      );
      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError(" عملیات ویرایش انجام نشد");

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "پروفایل با موفقیت به‌روزرسانی شد",
      });
    } catch (error) {
      const { fileUploadPath, filename } = req.body;
      const image = path.join(fileUploadPath, filename).replace(/\\/g, "/");
      deleteFileInPublic(image);
      next(error);
    }
  }
}

module.exports = {
  AdminController: new AdminController(),
};
