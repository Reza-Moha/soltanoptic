const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");

class CompanyModel extends Model {}

CompanyModel.init(
  {
    CompanyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "company",
    tableName: "companies",
    timestamps: true,
  },
);

module.exports = {
  CompanyModel,
};
