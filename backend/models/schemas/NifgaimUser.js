const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");
const NifgaimCommand = require("./NifgaimCommand");

class NifgaimUser extends Model {}

NifgaimUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    privateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [7, 7],
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(?=.{2,30}$)[א-ת']+(\s[א-ת']{1,}){1,2}$/,
      },
    },
    // commandName relation
    commandName: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: NifgaimCommand,
        key: "commandName",
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    editPerm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    managePerm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimUsers",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimUser;
