const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class PaymentInfoModel extends Model {}

PaymentInfoModel.init(
  {
    PaymentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    InvoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    SumTotalInvoice: {
      type: DataTypes.INTEGER,
    },
    PaymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    billBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descriptionPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "paymentInfo",
    tableName: "paymentInfo",
    timestamps: true,
  },
);

module.exports = {
  PaymentInfoModel,
};
