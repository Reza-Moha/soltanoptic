const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");

const Roles = sequelize.define(
  "Roles",
  {
    roleId: {
      type: UUID,
      defaultValue: UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.INTEGER,
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
  Roles,
};
