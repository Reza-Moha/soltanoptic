const { DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");
const LensGroup = sequelize.define(
  "LensGroup",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    pricing: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps: true,
    tableName: "lensGroup",
  }
);

module.exports = { LensGroup };
