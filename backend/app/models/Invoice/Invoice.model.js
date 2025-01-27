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
    orderLensFrom: {
      type: DataTypes.UUID,
    },
    paymentToAccount: {
      type: DataTypes.UUID,
    },
    insuranceName: {
      type: DataTypes.UUID,
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
