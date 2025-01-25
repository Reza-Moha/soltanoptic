const Controller = require("../../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const {
  createNewRoleSchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");
const { BlackListFields } = require("../../../constants/index");
const { Roles } = require("../../../models/Roles.model");
const { Permissions } = require("../../../models/Permissions.model");
const { deleteInvalidPropertyInObject } = require("../../../utils");
const {
  RolePermissionsModel,
} = require("../../../models/RolePermissions.model");
class RoleController extends Controller {
  async createNewRole(req, res, next) {
    try {
      await createNewRoleSchema.validateAsync(req.body);
      const { title, permissionsIds, description } = req.body;
      const permissionIds = permissionsIds.map((id) => id.toString());
      const exsistRole = await Roles.findOne({ where: { title } });
      if (exsistRole) {
        throw CreateError.BadRequest("نقش با این مشخصات قبلا ثبت شده است");
      }
      const validPermissions = await Permissions.findAll({
        where: {
          permissionId: permissionIds,
        },
      });

      const createRole = await Roles.create({
        title,
        description,
      });

      if (!createRole) {
        throw CreateError.InternalServerError(
          "ایجاد نقش با خطا مواجه شد لطفا دوباره تلاش کنید"
        );
      }
      const rolePermissions = validPermissions.map((permission) => ({
        roleId: createRole.roleId,
        permissionId: permission.permissionId,
      }));

      await RolePermissionsModel.bulkCreate(rolePermissions);

      return res.status(HttpStatus.CREATED).send({
        statusCode: res.statusCode,
        message: "نقش با موفقیت ایجاد شد",
        createdRole: createRole,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const allRoles = await Roles.findAll({
        include: {
          model: Permissions,
          as: "permissions",
          through: {
            attributes: [],
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allRoles,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoleById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");
      const Role = await Roles.findByPk(id);
      if (!Role) throw CreateError.NotFound("نقش با این مشخصات وجود ندارد");
      await Roles.destroy({ where: { roleId: id } });
      await RolePermissionsModel.destroy({ where: { roleId: id } });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "نقش با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;

      const existRole = await Roles.findByPk(id);
      if (!existRole) throw CreateError.NotFound("نقشی با این مشخصات پیدا نشد");

      await createNewRoleSchema.validateAsync(req.body);
      const { title, description, permissionsIds } = req.body;
      deleteInvalidPropertyInObject(req.body, BlackListFields);
      const [updatedRowsCount] = await Roles.update(
        { title, description },
        { where: { roleId: id }, returning: true }
      );

      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError("عملیات ویرایش انجام نشد");

      if (permissionsIds && permissionsIds.length > 0) {
        await RolePermissionsModel.destroy({ where: { roleId: id } });
        const rolePermissions = permissionsIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        }));
        await RolePermissionsModel.bulkCreate(rolePermissions);
      }

      const updatedRole = await Roles.findByPk(id, {
        include: {
          model: Permissions,
          as: "permissions",
          through: { attributes: [] },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "نقش مورد نظر با موفقیت ویرایش گردید",
        updatedRole,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  RoleController: new RoleController(),
};
