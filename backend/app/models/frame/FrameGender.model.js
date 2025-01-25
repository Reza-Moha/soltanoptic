const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class FrameGender extends Model {}

FrameGender.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    gender: {
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
    tableName: "FrameGender",
  }
);

module.exports = { FrameGender };
