const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../libs/DBConfig");

class UserPrescriptionModel extends Model {}

UserPrescriptionModel.init(
  {
    PrescriptionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    frameId: {
      type: DataTypes.UUID,
    },
    lensId: {
      type: DataTypes.UUID,
    },
    odSph: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    odCyl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    odAx: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    osSph: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    osCyl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    osAx: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frameColorCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "userPrescription",
    tableName: "userPrescription",
    timestamps: true,
  },
);

module.exports = {
  UserPrescriptionModel,
};
