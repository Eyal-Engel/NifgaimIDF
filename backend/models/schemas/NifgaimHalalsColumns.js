// const { Model, DataTypes } = require("sequelize");
// const db = require("../../dbConfig");

// class NifgaimHalalsColumns extends Model {}

// const columnTypeOptions = ["בחירה", "בוליאני", "תאריך", "מספר", "טקסט"];

// NifgaimHalalsColumns.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUID,
//       allowNull: false,
//       primaryKey: true,
//       unique: true,
//     },
//     columnName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     columnType: {
//       type: DataTypes.ENUM(...columnTypeOptions),
//       allowNull: false,
//     },
//     allowNull: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//     isUnique: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//     isOriginalColumns: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize: db,
//     modelName: "nifgaimHalalsColumns",
//     timestamps: false,
//     createdAt: true,
//   }
// );

// module.exports = NifgaimHalalsColumns;
