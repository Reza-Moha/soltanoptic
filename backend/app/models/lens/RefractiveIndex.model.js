const { DataTypes } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

const RefractiveIndex = sequelize.define(
  "RefractiveIndex",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    index: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    characteristics: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "lensRaftactiveIndex",
  }
);

module.exports = {
  RefractiveIndex,
};
