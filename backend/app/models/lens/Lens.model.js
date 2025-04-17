const { sequelize } = require("../../libs/DBConfig");
const { DataTypes } = require("sequelize");

const LensModel = sequelize.define(
  "Lens",
  {
    lensId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
      onDelete: "CASCADE",
    },
    lensName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lensImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = LensModel;
