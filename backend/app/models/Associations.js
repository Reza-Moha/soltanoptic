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
const { FrameColor } = require("./frame/FrameColor.model");
const { FrameImages } = require("./frame/FrameImage.model");
const { InvoiceModel } = require("./Invoice/Invoice.model");
const {
  UserPrescriptionModel,
} = require("./Invoice/MedicalPrescription.model");
const { PaymentInfoModel } = require("./Invoice/PaymentInfo.model");
const { CompanyModel } = require("./Company.model");
const { BankModel } = require("./Bank.model");
const { InsuranceModel } = require("./Insurance.model");

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

  FrameCategory.hasOne(FrameModel, { onDelete: "CASCADE" });
  FrameGender.hasOne(FrameModel, { onDelete: "CASCADE" });
  FrameType.hasOne(FrameModel, { onDelete: "CASCADE" });
  FrameModel.hasMany(FrameColor, { onDelete: "CASCADE" });
  FrameColor.hasMany(FrameImages, { onDelete: "CASCADE" });
  FrameColor.belongsTo(FrameModel, { onDelete: "CASCADE" });
  FrameImages.belongsTo(FrameColor, { onDelete: "CASCADE" });
  FrameModel.belongsTo(FrameCategory, { onDelete: "CASCADE" });
  FrameModel.belongsTo(FrameGender, { onDelete: "CASCADE" });
  FrameModel.belongsTo(FrameType, { onDelete: "CASCADE" });

  UserModel.hasMany(InvoiceModel, {
    foreignKey: "userId",
    as: "customerInvoices",
  });
  InvoiceModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  // Invoice -> UserPrescription
  InvoiceModel.hasMany(UserPrescriptionModel, {
    foreignKey: "InvoiceId",
    as: "prescriptions",
    onDelete: "CASCADE",
  });
  UserPrescriptionModel.belongsTo(InvoiceModel, {
    foreignKey: "InvoiceId",
    as: "invoice",
    onDelete: "CASCADE",
  });
  InvoiceModel.belongsTo(CompanyModel, {
    foreignKey: "orderLensFrom",
    as: "company",
  });
  InvoiceModel.belongsTo(BankModel, {
    foreignKey: "paymentToAccount",
    as: "bank",
  });
  InvoiceModel.belongsTo(InsuranceModel, {
    foreignKey: "insuranceName",
    as: "insurance",
  });

  // Invoice -> PaymentInfo
  InvoiceModel.hasOne(PaymentInfoModel, {
    foreignKey: "InvoiceId",
    as: "paymentInfo",
    onDelete: "CASCADE",
  });
  PaymentInfoModel.belongsTo(InvoiceModel, {
    foreignKey: "InvoiceId",
    as: "invoice",
    onDelete: "CASCADE",
  });
};
sequelize.sync({ alter: true });
module.exports = {
  Associations,
};
