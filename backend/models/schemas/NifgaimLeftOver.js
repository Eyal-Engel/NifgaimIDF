const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");

class NifgaimLeftOver extends Model {}

const proximityOptions = [
  "אבא",
  "אמא",
  "בן זוג",
  "בת זוג",
  "אח",
  "אחות",
  "בת",
  "בן",
];

NifgaimLeftOver.init(
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

    proximity: {
      type: DataTypes.ENUM(...proximityOptions),
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isReligious: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimLeftOvers",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimLeftOver;
