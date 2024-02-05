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
      validate: {},
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
