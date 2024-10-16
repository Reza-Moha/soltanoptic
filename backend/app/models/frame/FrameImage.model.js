const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class FrameImages extends Model {}

FrameImages.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "FrameImages",
  }
);

module.exports = { FrameImages };
