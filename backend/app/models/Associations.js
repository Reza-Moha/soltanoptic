const { sequelize } = require("../libs/DBConfig");
const { FrameModel } = require("./frame/Frame.model");
const { FrameCategory } = require("./frame/FramCategory.model");
const { FrameGender } = require("./frame/FrameGender.model");
const { FrameType } = require("./frame/FrameType.model");
const LensModel = require("./lens/Lens.model");
const { LensCategory } = require("./lens/LensCategory.model");
const { LensGroup } = require("./lens/LensGroup.model");
const { LensType } = require("./lens/LensType.model");
const { RefractiveIndex } = require("./lens/RefractiveIndex.model");
const { Permissions } = require("./Permissions.model");
const { RolePermissionsModel } = require("./RolePermissions.model");
const { Roles } = require("./Roles.model");
const { UserModel } = require("./User.model");

const Associations = () => {
  // roles & permissions
  Roles.belongsToMany(Permissions, {
    through: RolePermissionsModel,
    foreignKey: "roleId",
    as: "permissions",
  });
  Permissions.belongsToMany(Roles, {
    through: RolePermissionsModel,
    foreignKey: "permissionId",
    as: "roles",
  });
  Roles.belongsTo(UserModel);

  // user
  UserModel.hasOne(Roles);

  // lens

  LensCategory.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(LensCategory, { onDelete: "CASCADE" });

  RefractiveIndex.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(RefractiveIndex, { onDelete: "CASCADE" });

  LensType.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(LensType, { onDelete: "CASCADE" });

  LensGroup.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(LensGroup, { onDelete: "CASCADE" });

  // frame

  FrameCategory.hasOne(FrameModel);
  FrameGender.hasOne(FrameModel);
  FrameType.hasOne(FrameModel);

  FrameModel.belongsTo(FrameCategory);
  FrameModel.belongsTo(FrameGender);
  FrameModel.belongsTo(FrameType);
};
sequelize.sync({ alter: true });
module.exports = {
  Associations,
};
