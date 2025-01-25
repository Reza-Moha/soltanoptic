const { DataTypes } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");

const Permissions = sequelize.define(
  "Permissions",
  {
    permissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Permissions,
};
