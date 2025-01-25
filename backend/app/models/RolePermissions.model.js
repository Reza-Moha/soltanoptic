const { Sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");
const { Roles } = require("./Roles.model");
const { Permissions } = require("./Permissions.model");

const RolePermissionsModel = sequelize.define(
  "rolepermission",
  {
    rolePermissionId: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: Roles,
      },
    },
    permissionId: {
      type: DataTypes.UUID,
      references: {
        model: Permissions,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  RolePermissionsModel,
};
