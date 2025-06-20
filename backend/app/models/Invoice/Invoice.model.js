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
        "sendOrderSms",
        "delivered",
      ),
      allowNull: false,
      defaultValue: "registered",
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
