const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class InvoiceModel extends Model {}

InvoiceModel.init(
  {
    InvoiceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    SumTotalInvoice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoiceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    orderLensFrom: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    paymentToAccount: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    insuranceName: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lensOrderStatus: {
      type: DataTypes.ENUM(
        "registered",
        "orderLenses",
        "workShopSection",
        "readyToDeliver",
        "delivered",
      ),
      allowNull: false,
      defaultValue: "registered",
    },
    lensOrderAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lensOrderBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workShopSectionAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    workShopSectionBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    readyToDeliverAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    readyToDeliverBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "customerInvoice",
    tableName: "customerInvoice",
    timestamps: true,
  },
);

module.exports = {
  InvoiceModel,
};
