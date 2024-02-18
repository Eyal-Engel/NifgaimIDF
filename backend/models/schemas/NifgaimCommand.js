const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../dbConfig");

class NifgaimCommand extends Model {}

NifgaimCommand.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    commandName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isNewSource: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "nifgaimCommands",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimCommand;
