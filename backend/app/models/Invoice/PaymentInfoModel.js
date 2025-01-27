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
    PaymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["CASH", "CARD", "BANK_TRANSFER"]],
          msg: "روش پرداخت معتبر نیست",
        },
      },
    },
    PaymentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    PaymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    TransactionReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DiscountAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    DepositAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    BillBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
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
