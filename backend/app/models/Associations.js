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

const { PaymentInfoModel } = require("./Invoice/PaymentInfo.model");
const { CompanyModel } = require("./Company.model");
const { BankModel } = require("./Bank.model");
const { InsuranceModel } = require("./Insurance.model");
const { UserPrescriptionModel } = require("./Invoice/UserPrescription.model");
const {
  LensOrderStatusTracking,
} = require("./Invoice/LensOrderStatusTracking.model");

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
  UserModel.hasMany(InvoiceModel, {
    foreignKey: "userId",
    as: "customerInvoices",
  });

  InvoiceModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "customer",
  });

  UserModel.hasMany(InvoiceModel, {
    foreignKey: "employeeId",
    as: "employeeInvoices",
  });

  InvoiceModel.belongsTo(UserModel, {
    foreignKey: "employeeId",
    as: "employee",
  });

  UserModel.hasMany(LensOrderStatusTracking, {
    foreignKey: "workShopSectionBy",
    sourceKey: "id",
    as: "workShopSectionTracks",
  });

  UserModel.hasMany(LensOrderStatusTracking, {
    foreignKey: "readyToDeliverBy",
    sourceKey: "id",
    as: "readyToDeliverTracks",
  });

  UserModel.hasMany(LensOrderStatusTracking, {
    foreignKey: "deliveredBy",
    sourceKey: "id",
    as: "deliveredTracks",
  });

  UserModel.hasMany(LensOrderStatusTracking, {
    foreignKey: "sendOrderSmsBy",
    sourceKey: "id",
    as: "sendOrderSmsTracks",
  });

  // LensOrderStatusTracking belongs to Users
  LensOrderStatusTracking.belongsTo(UserModel, {
    foreignKey: "workShopSectionBy",
    targetKey: "id",
    as: "workShopSectionByUser",
  });

  LensOrderStatusTracking.belongsTo(UserModel, {
    foreignKey: "readyToDeliverBy",
    targetKey: "id",
    as: "readyToDeliverByUser",
  });

  LensOrderStatusTracking.belongsTo(UserModel, {
    foreignKey: "deliveredBy",
    targetKey: "id",
    as: "deliveredByUser",
  });

  LensOrderStatusTracking.belongsTo(UserModel, {
    foreignKey: "sendOrderSmsBy",
    targetKey: "id",
    as: "sendOrderSmsByUser",
  });
  // lens

  LensCategory.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(LensCategory, { onDelete: "CASCADE" });

  RefractiveIndex.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(RefractiveIndex, { onDelete: "CASCADE" });

  LensType.hasOne(LensModel, { onDelete: "CASCADE" });
  LensModel.belongsTo(LensType, { onDelete: "CASCADE" });

  LensModel.belongsTo(LensOrderStatusTracking, {
    as: "lensOrderStatusTracking",
    foreignKey: "lensOrderStatusTrackingId",
  });
  LensOrderStatusTracking.hasOne(LensModel, {
    as: "lens",
    foreignKey: "lensOrderStatusTrackingId",
  });

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
  UserPrescriptionModel.belongsTo(FrameModel, {
    foreignKey: "frameId",
    as: "frame",
  });

  UserPrescriptionModel.belongsTo(LensModel, {
    foreignKey: "lensId",
    as: "lens",
  });
  CompanyModel.hasMany(InvoiceModel, {
    foreignKey: "orderLensFrom",
    as: "invoices",
  });
  FrameModel.hasMany(UserPrescriptionModel, {
    foreignKey: "frameId",
    as: "prescriptions",
  });

  LensModel.hasMany(UserPrescriptionModel, {
    foreignKey: "lensId",
    as: "prescriptions",
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
