const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");

class NifgaimSoldierAccompanied extends Model {}

NifgaimSoldierAccompanied.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },

    // halalId relation

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    privateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [7, 7]
      },
    },

    rank: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimSoldierAccompanieds",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimSoldierAccompanied;
