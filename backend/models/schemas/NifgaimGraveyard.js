const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");

class NifgaimGraveyard extends Model {}

NifgaimGraveyard.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    graveyardName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimGraveyards",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimGraveyard;
