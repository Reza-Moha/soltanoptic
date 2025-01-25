const { DataTypes } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");

const InsuranceModel = sequelize.define(
  "InsuranceModel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    insuranceName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    insuranceFranchise: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 10,
        max: 99,
        isInt: true,
      },
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    panelUserName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    websiteLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panelPassword: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "insurance",
  }
);

module.exports = {
  InsuranceModel,
};
