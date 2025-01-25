const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class FrameType extends Model {}

FrameType.init(
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
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "FrameType",
  }
);

module.exports = { FrameType };
