const { BlackListFields } = require("../../constants");
const { UserModel } = require("../../models/User.model");
const {
  deleteInvalidPropertyInObject,
  deleteFileInPublic,
} = require("../../utils");
const path = require("path");
const {
  createNewEmployeeSchema,
  idSchema,
} = require("../../validation/admin/admin.schema");
const Controller = require("../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const { Op } = require("sequelize");
const { Roles } = require("../../models/Roles.model");
class EmployeeController extends Controller {
  async createNewEmployee(req, res, next) {
    try {

      await createNewEmployeeSchema.validateAsync(req.body);

      const {
        fileUploadPath,
        filename,
        phoneNumber,
        fullName,
        gender,
        nationalId,
        jobTitle,
        description,
      } = req.body;

      const image =
        fileUploadPath && filename
          ? path.join(fileUploadPath, filename).replace(/\\/g, "/")
          : null;

      deleteInvalidPropertyInObject(req.body, BlackListFields);

      const existingUser = await UserModel.findOne({
        where: {
          [Op.or]: [{ phoneNumber }, { nationalId }],
        },
      });

      if (existingUser) {
        throw CreateError.BadRequest("همکاری با این مشخصات قبلاً ثبت شده است");
      }

      const newEmployee = await UserModel.create({
        profileImage: image,
        phoneNumber,
        fullName,
        gender,
        nationalId,
        jobTitle,
        description,
        role: process.env.EMPLOYEE_ROLE, 
      });

      if (!newEmployee) {
        throw CreateError.InternalServerError(
          "ایجاد همکار جدید با خطا مواجه شد لطفاً دوباره تلاش کنید",
        );
      }


      const [updatedRowsCount] = await Roles.update(
        { UserId: newEmployee.id },
        {
          where: { roleId: jobTitle },
          returning: true,
        },
      );

      if (updatedRowsCount === 0) {
        throw CreateError.InternalServerError("عملیات ویرایش نقش انجام نشد");
      }


      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "همکار جدید با موفقیت ثبت گردید",
        newEmployee: await UserModel.findOne({
          where: { id: newEmployee.id },
          attributes: { exclude: ["otp", "createdAt", "updatedAt"] },
        }),
      });
    } catch (error) {
  
      if (req.body.fileUploadPath && req.body.filename) {
        const image = path
          .join(req.body.fileUploadPath, req.body.filename)
          .replace(/\\/g, "/");
        deleteFileInPublic(image);
      }

      next(error);
    }
  }

  async getAllEmployee(req, res, next) {
    try {
      const allEmployee = await UserModel.findAll({
        where: { role: process.env.EMPLOYEE_ROLE },
        attributes: { exclude: ["otp", "createdAt", "updatedAt", "role"] },
      });
      if (!allEmployee) throw CreateError.NotFound("همکاری یافت نشد");
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployeeById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;

      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");

      const user = await UserModel.findByPk(id);
      if (!user) throw CreateError.NotFound("همکار با این مشخصات وجود ندارد");

      if (user.profileImage) {
        deleteFileInPublic(user.profileImage);
      }

      const deletedRows = await UserModel.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw CreateError.NotFound("هیچ رکوردی برای حذف یافت نشد");
      }

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "همکار با موفقیت حذف شد",
      });
    } catch (error) {
      console.error("Error occurred:", error);
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const image = req.body.fileUploadPath
        ? path
            .join(req.body?.fileUploadPath, req.body?.filename)
            .replace(/\\/g, "/")
        : undefined;

      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const existEmployee = await UserModel.findByPk(id, {
        attributes: { exclude: ["otp"] },
      });

      if (image) deleteFileInPublic(existEmployee.profileImage);
      if (!existEmployee && existEmployee.role !== process.env.USER_ROLE)
        throw CreateError.NotFound("همکار با این مشخصات پیدا نشد");

      await createNewEmployeeSchema.validateAsync(req.body);
      const data = JSON.parse(JSON.stringify(req.body));
      deleteInvalidPropertyInObject(data, []);
      const [updatedRowsCount] = await UserModel.update(
        {
          fullName: data?.fullName,
          phoneNumber: data?.phoneNumber,
          nationalId: data?.nationalId,
          profileImage: image ? image : existEmployee?.profileImage,
          description: data?.description,
          gender: data?.gender,
          jobTitle: data?.jobTitle,
        },
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError(" عملیات ویرایش انجام نشد");
      const updatedEmployee = await UserModel.findByPk(id);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "همکار مورد نظر با موفقیت ویرایش گردید",
        updatedEmployee,
      });
    } catch (error) {
      const { fileUploadPath, filename } = req.body;
      const image =
        fileUploadPath && filename
          ? path.join(fileUploadPath, filename)?.replace(/\\/g, "/")
          : "";
      deleteFileInPublic(image);
      next(error);
    }
  }
}

module.exports = {
  EmployeeController: new EmployeeController(),
};
