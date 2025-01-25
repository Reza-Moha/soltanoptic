const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../libs/DBConfig");

class BankModel extends Model {}

BankModel.init(

    {
        BankId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        bankAccountHolder: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shabaNumber: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        cartNumber: {
            type: DataTypes.STRING,
            allowNull: false,

        },bankName: {
            type: DataTypes.STRING,
            allowNull: false,

        },
    },
    {
        sequelize,
        modelName: "bank",
        tableName: "banks",
        timestamps: true,
    }
);

module.exports = {
    BankModel,
};
