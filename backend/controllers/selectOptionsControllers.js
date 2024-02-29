// const NifgaimSelectOptions = require("../models/schemas/NifgaimSelectOptions");

// // Controller to get all options
// const getAllOptions = async (req, res) => {
//   try {
//     const options = await NifgaimSelectOptions.findAll();
//     res.json(options);
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to get option by ID
// const getOptionsById = async (req, res) => {
//   const { optionId } = req.params;
//   try {
//     const option = await NifgaimSelectOptions.findByPk(optionId);
//     if (!option) {
//       const error = new Error(`Option with ID ${optionId} not found.`, 404);
//       return next(error);
//     }
//     res.json(option);
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to get all options by column ID
// const getAllOptionsByColumnName = async (req, res) => {
//   const { columnName } = req.body;
//   try {
//     const options = await NifgaimSelectOptions.findAll({
//       where: { columnName },
//     });
//     res.json(options);
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to create an option
// const createOption = async (req, res) => {
//   const { optionName } = req.body;
//   const id = uuidv4();

//   try {
//     const newOption = await NifgaimSelectOptions.create({ id, optionName });
//     res.json(newOption);
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to update an option
// const updateOption = async (req, res) => {
//   const { optionId } = req.params;
//   const { optionName } = req.body;
//   try {
//     const updatedOption = await NifgaimSelectOptions.update(
//       { optionName },
//       { where: { id: optionId } }
//     );
//     if (updatedOption[0] === 0) {
//       const error = new Error(`Option with ID ${optionId} not found.`, 404);
//       return next(error);
//     }
//     res.json(updatedOption);
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to delete an option
// const deleteOption = async (req, res) => {
//   const { optionId } = req.params;
//   try {
//     const deletedOptionCount = await NifgaimSelectOptions.destroy({
//       where: { id: optionId },
//     });
//     if (deletedOptionCount === 0) {
//       const error = new Error(`Option with ID ${optionId} not found.`, 404);
//       return next(error);
//     }
//     res.json({ message: "Option deleted successfully" });
//   } catch (error) {
//     return next(err);
//   }
// };

// // Controller to delete all options by column ID
// const deleteAllOptionsByColumnName = async (req, res) => {
//   const { columnName } = req.body;
//   try {
//     await NifgaimSelectOptions.destroy({ where: { columnName } });
//     res.json({ message: "All options deleted successfully" });
//   } catch (error) {
//     return next(err);
//   }
// };

// module.exports = {
//   getAllOptions,
//   getOptionsById,
//   getAllOptionsByColumnName,
//   createOption,
//   updateOption,
//   deleteOption,
//   deleteAllOptionsByColumnName,
// };
