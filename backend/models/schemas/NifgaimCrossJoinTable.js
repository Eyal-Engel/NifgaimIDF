// const { Model, DataTypes } = require("sequelize");
// const db = require("../../dbConfig");

// class CrossJoinTable extends Model {}

// CrossJoinTable.init(
//   {
//     halalId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: "nifgaimHalals",
//         key: "id",
//       },
//     },
//     columnId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: "nifgaimHalalsColumns",
//         key: "id",
//       },
//     },
//     value: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     sequelize: db,
//     modelName: "CrossJoinTable",
//     timestamps: false,
//   }
// );

// module.exports = CrossJoinTable;
