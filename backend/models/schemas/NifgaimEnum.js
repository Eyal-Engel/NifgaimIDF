const { Model, DataTypes } = require("sequelize");
const db = require("../../dbConfig");

class NifgaimEnum extends Model {}

NifgaimEnum.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    halalColumnName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "nifgaimEnums",
    timestamps: false,
    createdAt: true,
    // Define composite unique constraint for halalColumnName and value
    indexes: [
      {
        unique: true,
        fields: ["halalColumnName", "value"],
      },
    ],
  }
);

module.exports = NifgaimEnum;
