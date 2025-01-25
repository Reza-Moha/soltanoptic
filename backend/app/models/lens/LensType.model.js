const { DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");
const LensType = sequelize.define(
  "LensType",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: "lensType",
  }
);

module.exports = { LensType };
