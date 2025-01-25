const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class LensCategory extends Model {}

LensCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    lensCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lensImage: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "lensCategory",
  }
);

module.exports = { LensCategory };
