const Controller = require("../../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const {
  createNewPermissionSchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");

const { Permissions } = require("../../../models/Permissions.model");
const { BlackListFields } = require("../../../constants/index");
const { deleteInvalidPropertyInObject } = require("../../../utils/index");
class PermissionsController extends Controller {
  async createNewPermission(req, res, next) {
    try {
      await createNewPermissionSchema.validateAsync(req.body);
      const { title, description } = req.body;
      const existPermission = await Permissions.findOne({
        where: { title },
      });
      if (existPermission)
        throw CreateError.BadRequest("سطح دسترسی قبلا ایجاد شده است");
      const createPermission = await Permissions.create({
        title,
        description,
      });
      if (!createPermission) {
        throw CreateError.InternalServerError("خطا در ایجاد سطح دسترسی");
      }

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "سطح دسترسی با موفقیت ایجاد شد",
        permission: createPermission,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPermission(req, res, next) {
    try {
      const allPermission = await Permissions.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allPermission,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePermissionById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id: permissionId } = req.params;
      if (!permissionId) throw CreateError.BadRequest("شناسه نامعتبر است");
      const permission = await Permissions.findByPk(permissionId);
      if (!permission)
        throw CreateError.NotFound("سطح دسترسی با این مشخصات وجود ندارد");
      await Permissions.destroy({ where: { permissionId } });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "سطح دسترسی با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id: permissionId } = req.params;
      const existPermission = await Permissions.findByPk(permissionId);
      if (!existPermission)
        throw CreateError.NotFound("سطحی با این مشخصات پیدا نشد");
      await createNewPermissionSchema.validateAsync(req.body);
      const data = JSON.parse(JSON.stringify(req.body));
      deleteInvalidPropertyInObject(data, BlackListFields);
      const [updatedRowsCount] = await Permissions.update(
        { title: data.title, description: data.description },
        {
          where: { permissionId },
          returning: true,
        }
      );

      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError(" عملیات ویرایش انجام نشد");
      const updatedPermission = await Permissions.findByPk(permissionId);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "سطح مورد نظر با موفقیت ویرایش گردید",
        permission: updatedPermission,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  PermissionsController: new PermissionsController(),
};
