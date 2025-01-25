const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");
class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    gender: {
      type: DataTypes.STRING,
    },
    nationalId: {
      type: DataTypes.STRING,
    },
    jobTitle: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.JSONB,
      defaultValue: {
        code: 0,
        expiresIn: 0,
      },
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 35214,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  }
);

module.exports = {
  UserModel,
};
