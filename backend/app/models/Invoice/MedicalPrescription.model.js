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
    odSph: {
      type: DataTypes.STRING,
    },
    odCyl: {
      type: DataTypes.STRING,
    },
    odAx: {
      type: DataTypes.STRING,
    },
    osSph: {
      type: DataTypes.STRING,
    },
    osCyl: {
      type: DataTypes.STRING,
    },
    osAx: {
      type: DataTypes.STRING,
    },
    pd: {
      type: DataTypes.STRING,
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
