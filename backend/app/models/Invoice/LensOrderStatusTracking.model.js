const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class LensOrderStatusTracking extends Model {}

LensOrderStatusTracking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lensOrderAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lensOrderedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    workShopSectionAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    workShopSectionBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    readyToDeliverAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    readyToDeliverBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    sendOrderSmsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sendOrderSmsBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "lensOrderStatusTracking",
    tableName: "lensOrderStatusTracking",
    timestamps: true,
  },
);

module.exports = { LensOrderStatusTracking };
