const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class FrameColor extends Model {}

FrameColor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    colorCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "FrameColor",
  }
);

module.exports = { FrameColor };
