const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");

class NifgaimHalal extends Model {}

const serviceTypeOptions = ["מילואים", "קבע", "סדיר"];

NifgaimHalal.init(
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
        len: [7, 7]
      },
    },

    // commandId relation

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dateOfDeath: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM(...serviceTypeOptions),
      allowNull: false,
    },
    circumstances: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialCommunity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    //   graveyradName relation

    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    line: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graveNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permanentRelationship: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimHalals",
    timestamps: false,
    createdAt: true,
  }
);

module.exports = NifgaimHalal;
