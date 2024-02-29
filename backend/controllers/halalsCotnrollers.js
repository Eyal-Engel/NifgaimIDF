const { validationResult } = require("express-validator");
const Halal = require("../models/schemas/NifgaimHalal");
const User = require("../models/schemas/NifgaimUser");
const Command = require("../models/schemas/NifgaimCommand");

const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Sequelize, Op } = require("sequelize");
const sequelize = require("../dbConfig");

const getHalals = async (req, res, next) => {
  try {
    const halals = await Halal.findAll({});
    res.json(halals);
  } catch (err) {
    return next(err);
  }
};

const getOriginalColumns = async (req, res, next) => {
  try {
    console.log("Halal.rawAttributes");
    const columns = Object.keys(Halal.rawAttributes);
    res.json(columns);
  } catch (err) {
    return next(err);
  }
};

const getColumnNamesAndTypes = async (req, res, next) => {
  try {
    // Run the SQL query to fetch detailed information about columns
    // const columns = await sequelize.query(
    //   `SELECT column_name, data_type, ordinal_position, is_nullable, column_default,
    //           character_maximum_length, numeric_precision, numeric_scale, datetime_precision
    //    FROM information_schema.columns
    //    WHERE table_name = 'nifgaimHalals';`,
    const columns = await sequelize.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns 
       WHERE table_name = 'nifgaimHalals';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(columns);
  } catch (error) {
    return next(error);
  }
};

// expected input to addHalalColumn
// {
//   "columnName": "example_column",
//    "dataType":"select: [value1, value2, value3]",
//   "defaultValue": "value1",
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }
const addHalalColumn = async (req, res, next) => {
  try {
    const { columnName, dataType, defaultValue } = req.body;
    const { userId } = req.body;
    const userRequested = await User.findByPk(userId);
    const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
    const userCommandName = userCommand.commandName;
    let defaultValuePost = defaultValue;

    console.log(userId, columnName, dataType, defaultValue);
    console.log(dataType);
    if (
      !userRequested ||
      userRequested === null ||
      userRequested === undefined
    ) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist" }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    if (!columnName || !dataType) {
      return res.status(400).json({
        body: {
          errors: [{ message: "Column name and data type are required." }],
        },
      });
    }

    if (defaultValuePost === undefined) {
      defaultValuePost = null;
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists =
      await queryInterface.sequelize.queryInterface.showAllTables();

    if (!tableExists.includes("nifgaimHalals")) {
      return res.status(400).json({
        body: {
          errors: [{ message: "Table 'NifgaimHalals' does not exist." }],
        },
      });
    }

    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (columnName in tableDescription) {
      return res.status(400).json({
        body: {
          errors: [{ message: `Column '${columnName}' already exists.` }],
        },
      });
    }

    // Validate the default value for the specified data type
    if (dataType.startsWith("select: ")) {
      const enumValues = dataType
        .substring(8)
        .slice(1, -1)
        .split(", ")
        .map((value) => value.trim()); // Remove leading and trailing whitespace
      if (!enumValues.includes(defaultValuePost)) {
        return res.status(400).json({
          body: {
            errors: [
              {
                message: `Default value '${defaultValuePost}' is not valid for data type '${dataType}'.`,
              },
            ],
          },
        });
      }
    } else if (!isValidDefaultValue(dataType, defaultValuePost)) {
      return res.status(400).json({
        body: {
          errors: [
            {
              message: `Default value '${defaultValuePost}' is not valid for data type '${dataType}'.`,
            },
          ],
        },
      });
    }
    // Define the migration code to add the new column
    await queryInterface.addColumn(
      "nifgaimHalals", // Your model's table name
      columnName, // Name of the new column
      {
        type: dataType.startsWith("select: ")
          ? sequelize.Sequelize.ENUM(
              ...dataType.substring(8).slice(1, -1).split(", ")
            )
          : sequelize.Sequelize.DataTypes[dataType], // Data type of the new column
        allowNull: true, // or false based on your requirement
        defaultValue: defaultValuePost || null,
      }
    );

    console.log("New column added successfully.");

    res.status(200).json({ message: "New column added successfully." });
  } catch (error) {
    console.error("Error adding column:", error);
    return next(error);
  }
};

const determineType = (input) => {
  if (!isNaN(input)) {
    // Check if input is a number
    return "Integer";
  } else if (input === "true" || input === "false") {
    // Check if input is a boolean
    return "Boolean";
  } else if (!isNaN(Date.parse(input))) {
    // Check if input is a date
    return "Date";
  } else {
    return "String"; // Default to String if none of the above conditions match
  }
};

// Function to validate default value based on data type
function isValidDefaultValue(dataType, defaultValue) {
  const typeOfDefaultValue = determineType(defaultValue);
  return (
    typeOfDefaultValue.toLowerCase() === dataType.toLowerCase() ||
    defaultValue === null
  );
}

// body example:
// {
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48",
//   "columnName": "column12345",
//   "newColumnName": "column12345",
//   "columnDefault": 510
// }
const updateHalalColumn = async (req, res, next) => {
  try {
    const { userId, columnName, newColumnName, columnDefault } = req.body;

    console.log(req.body);
    console.log(userId);
    console.log(columnName);
    console.log(newColumnName);
    console.log(columnDefault);

    const userRequested = await User.findByPk(userId);
    const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (
      !userRequested ||
      userRequested === null ||
      userRequested === undefined
    ) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist." }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized." }] } });
    }

    if (!columnName && !columnDefault) {
      return res.status(400).json({
        message: "at least 1 of new column name or columnDefault are required.",
      });
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("nifgaimHalals")) {
      return res
        .status(400)
        .json({ message: "Table 'nifgaimHalals' does not exist." });
    }

    // Check if the column exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (!(columnName in tableDescription)) {
      return res
        .status(400)
        .json({ message: `Column '${columnName}' does not exist.` });
    }

    if (
      newColumnName !== undefined &&
      newColumnName !== null &&
      newColumnName !== "" &&
      columnName !== newColumnName
    ) {
      await queryInterface.renameColumn(
        "nifgaimHalals", // Your model's table name
        columnName, // Current name of the column
        newColumnName // New name for the column
      );

      console.log("Column name updated successfully.");

      if (
        columnDefault !== undefined &&
        columnDefault !== null &&
        columnDefault !== ""
      ) {
        await queryInterface.changeColumn(
          "nifgaimHalals", // Table name
          newColumnName, // Column name
          {
            defaultValue: columnDefault, // New default value
          }
        );
        console.log(
          `Default value for column '${newColumnName}' updated successfully.`
        );
      }
    } else {
      if (
        columnDefault !== undefined &&
        columnDefault !== null &&
        columnDefault !== ""
      ) {
        await queryInterface.changeColumn(
          "nifgaimHalals", // Your model's table name
          columnName, // Current name of the column
          {
            // type: sequelize.Sequelize.DataTypes[dataType], // Assuming the column type is INTEGER, change it accordingly
            defaultValue: columnDefault, // New default value
          }
        );
        console.log(
          `Default value for column '${newColumnName}' updated successfully.`
        );
      }
    }

    console.log(columnDefault); // Check if columnDefault is provided, if yes, alter column to change its default value

    res
      .status(200)
      .json({ message: "Column name and default value updated successfully." });
  } catch (error) {
    console.error("Error updating column name:", error);
    return next(error);
  }
};

// body example:
// {
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48",
//   "newColumnName": "column1234",
//   "newEnumValues": ["value1", "value2", "value3"],
//   "column_default": "value"
// }
const updateHalalSelectColumn = async (req, res, next) => {
  try {
    const { userId, columnName, newColumnName, newEnumValues, column_default } =
      req.body;

    const userRequested = await User.findByPk(userId);
    const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (!userRequested) {
      return res
        .status(404)
        .json({ errors: [{ message: "User does not exist" }] });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ errors: [{ message: "User is not authorized" }] });
    }

    if (!newColumnName || !newEnumValues) {
      return res.status(400).json({
        errors: [
          { message: "New column name and new enum values are required." },
        ],
      });
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("nifgaimHalals")) {
      return res
        .status(400)
        .json({ message: "Table 'NifgaimHalals' does not exist." });
    }

    // Check if the column exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (!tableDescription[columnName]) {
      return res
        .status(400)
        .json({ message: `Column '${columnName}' does not exist.` });
    }

    // Verify if the column is of type ENUM or USER-DEFINED (custom type)
    const columnDataType = tableDescription[columnName].type;
    if (
      !(columnDataType.startsWith("ENUM") || columnDataType === "USER-DEFINED")
    ) {
      return res.status(400).json({
        message: `Column '${columnName}' is not of type ENUM or USER-DEFINED.`,
      });
    }

    // For USER-DEFINED type, extract the enum values from the default value
    let enumValues;
    let defaultValue = column_default; // Initialize with the provided default value
    if (columnDataType === "USER-DEFINED") {
      console.log(tableDescription[columnName]);
      const defaultEnumValue = tableDescription[columnName].defaultValue;
      if (defaultEnumValue !== undefined && defaultEnumValue !== null) {
        // Extract enum values from the special property
        enumValues = tableDescription[columnName].special;
        // If column_default is provided, update the defaultValue
        if (column_default) {
          defaultValue = column_default;
        }
      } else {
        // Handle the case where default value is null
        enumValues = [];
      }
    } else {
      // Fetch existing enum values
      const existingEnumValues = await queryInterface.sequelize.query(
        `SELECT enum_range(NULL::"${columnName}"::text)`
      );

      enumValues = existingEnumValues[0][0].enum_range
        .replace(`["${columnName}_`, "")
        .replace(/"/g, "") // Remove quotes around enum values
        .replace("]", "")
        .split(",");
    }

    // Check if any halal record has a value not in the new enum values
    const recordsToUpdate = await Halal.findAll({
      where: {
        [columnName]: { [Op.notIn]: enumValues },
      },
    });

    // Update the halal records
    await Promise.all(
      recordsToUpdate.map(async (record) => {
        if (!newEnumValues.includes(record[columnName])) {
          record[newColumnName] = null;
        } else {
          record[newColumnName] = record[columnName];
        }
        await record.save();
      })
    );

    // Remove the old column
    await queryInterface.removeColumn("nifgaimHalals", columnName);

    // Add the new column with the updated enum values and default value
    await queryInterface.addColumn("nifgaimHalals", newColumnName, {
      type: sequelize.Sequelize.ENUM(...newEnumValues),
      allowNull: true,
      defaultValue, // Set the default value
    });

    console.log("Column updated successfully.");

    res.status(200).json({ message: "Column updated successfully." });
  } catch (error) {
    console.error("Error updating column:", error);
    return next(error);
  }
};

const replaceColumnValue = async (req, res, next) => {
  try {
    const { prevValue, newValue, columnName } = req.body;

    // Check if the column name, previous value, and new value are provided
    if (!columnName || !prevValue || !newValue) {
      return res.status(400).json({
        errors: [
          {
            message: "Column name, previous value, and new value are required.",
          },
        ],
      });
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("yourTableName")) {
      return res.status(400).json({ message: "Table does not exist." });
    }

    // Fetch all rows where the specified column has the previous value
    const rowsToUpdate = await YourModel.findAll({
      where: {
        [columnName]: prevValue,
      },
    });

    // Update the rows with the new value
    await Promise.all(
      rowsToUpdate.map(async (row) => {
        row[columnName] = newValue;
        await row.save();
      })
    );

    console.log("Rows updated successfully.");

    res.status(200).json({ message: "Rows updated successfully." });
  } catch (error) {
    console.error("Error updating rows:", error);
    return next(error);
  }
};

// const deleteHalalSelectColumn = async (req, res, next) => {
//   try {
//     const { columnName } = req.params;
//     const { userId } = req.body;

//     const userRequested = await User.findByPk(userId);
//     const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
//     const userCommandName = userCommand.commandName;

//     if (!userRequested) {
//       return res
//         .status(404)
//         .json({ body: { errors: [{ message: "User does not exist" }] } });
//     }

//     if (userCommandName !== "חיל הלוגיסטיקה") {
//       return res
//         .status(403)
//         .json({ body: { errors: [{ message: "User is not authorized" }] } });
//     }

//     if (!columnName) {
//       return res.status(400).json({ message: "Column name is required." });
//     }

//     // Get the queryInterface from your Sequelize instance
//     const queryInterface = sequelize.getQueryInterface();

//     // Check if the table exists
//     const tableExists = await queryInterface.showAllTables();
//     if (!tableExists.includes("nifgaimHalals")) {
//       return res
//         .status(400)
//         .json({ message: "Table 'NifgaimHalals' does not exist." });
//     }

//     // Check if the column exists
//     const tableDescription = await queryInterface.describeTable(
//       "nifgaimHalals"
//     );
//     if (!tableDescription[columnName]) {
//       return res
//         .status(400)
//         .json({ message: `Column '${columnName}' does not exist.` });
//     }

//     // Verify if the column is of type ENUM
//     const columnDataType = tableDescription[columnName].type;
//     if (!columnDataType.startsWith("ENUM")) {
//       return res
//         .status(400)
//         .json({ message: `Column '${columnName}' is not of type ENUM.` });
//     }

//     // Check if any halal record has the specified column with enum values to be removed
//     const halalRecordsToUpdate = await Halal.findAll({
//       where: { [columnName]: { [sequelize.Sequelize.Op.not]: null } },
//     });

//     // Update the halal records with the column value to null if it has the enum values to be removed
//     await Promise.all(
//       halalRecordsToUpdate.map(async (record) => {
//         if (record[columnName] && record[columnName] !== "") {
//           await record.update({ [columnName]: null });
//         }
//       })
//     );

//     // Remove the column
//     await queryInterface.removeColumn("nifgaimHalals", columnName);

//     console.log("Column deleted successfully.");

//     res.status(200).json({ message: "Column deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting column:", error);
//     return next(error);
//   }
// };

// body example:
// {
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }
const deleteHalalColumn = async (req, res, next) => {
  try {
    const { userId, columnName } = req.body;

    const userRequested = await User.findByPk(userId);
    const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (
      !userRequested ||
      userRequested === null ||
      userRequested === undefined
    ) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    if (!columnName) {
      return res.status(400).json({ message: "Column name is required." });
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("nifgaimHalals")) {
      return res
        .status(400)
        .json({ message: "Table 'NifgaimHalals' does not exist." });
    }

    // Check if the column exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (!(columnName in tableDescription)) {
      return res
        .status(400)
        .json({ message: `Column '${columnName}' does not exist.` });
    }

    // Define the migration code to remove the column
    await queryInterface.removeColumn("nifgaimHalals", columnName);

    console.log("Column deleted successfully.");

    res.status(200).json({ message: "Column deleted successfully." });
  } catch (error) {
    console.error("Error deleting column:", error);
    return next(error);
  }
};

const getHalalById = async (req, res, next) => {
  const halalId = req.params.halalId;
  try {
    const halal = await Halal.findByPk(halalId);
    if (!halal) {
      const error = new Error(`Halal with ID ${halalId} not found.`, 404);
      return next(error);
    }
    res.json(halal);
  } catch (err) {
    return next(err);
  }
};

const getHalalsByCommandId = async (req, res, next) => {
  const commandId = req.params.commandId;
  try {
    const halals = await Halal.findAll({
      where: { nifgaimCommandId: commandId },
    });
    res.json(halals);
  } catch (err) {
    return next(err);
  }
};

const createHalal = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }
  const id = uuidv4();

  const {
    privateNumber,
    lastName,
    firstName,
    dateOfDeath,
    serviceType,
    circumstances,
    nifgaimGraveyardId,
    unit,
    division,
    specialCommunity,
    area,
    plot,
    line,
    graveNumber,
    permanentRelationship,
    comments,
    commandId,
  } = req.body;

  try {
    const newHalal = await Halal.create({
      id,
      privateNumber,
      lastName,
      firstName,
      dateOfDeath,
      serviceType,
      circumstances,
      nifgaimGraveyardId,
      unit,
      division,
      specialCommunity,
      area,
      plot,
      line,
      graveNumber,
      permanentRelationship,
      comments,
      nifgaimCommandId: commandId,
    });
    res.status(201).json(newHalal);
  } catch (err) {
    return next(err);
  }
};

const updateHalal = async (req, res, next) => {
  const halalId = req.params.halalId;
  const {
    privateNumber,
    lastName,
    firstName,
    dateOfDeath,
    serviceType,
    circumstances,
    unit,
    division,
    specialCommunity,
    area,
    plot,
    line,
    graveNumber,
    permanentRelationship,
    comments,
    commandId,
  } = req.body;

  try {
    const halal = await Halal.findByPk(halalId);
    if (!halal) {
      const error = new Error(`Halal with ID ${halalId} not found.`, 404);
      return next(error);
    }
    halal.privateNumber = privateNumber;
    halal.lastName = lastName;
    halal.firstName = firstName;
    halal.dateOfDeath = dateOfDeath;
    halal.serviceType = serviceType;
    halal.circumstances = circumstances;
    halal.unit = unit;
    halal.division = division;
    halal.specialCommunity = specialCommunity;
    halal.area = area;
    halal.plot = plot;
    halal.line = line;
    halal.graveNumber = graveNumber;
    halal.permanentRelationship = permanentRelationship;
    halal.comments = comments;
    halal.nifgaimCommandId = commandId;
    await halal.save();
    res.json(halal);
  } catch (err) {
    return next(err);
  }
};

const deleteHalal = async (req, res, next) => {
  const halalId = req.params.halalId;
  try {
    const halal = await Halal.findByPk(halalId);
    if (!halal) {
      const error = new Error(`Halal with ID ${halalId} not found.`, 404);
      return next(error);
    }
    await halal.destroy();
    res.status(200).json({ message: `Deleted halal ${halalId}` });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getHalals,
  getOriginalColumns,
  getHalalById,
  getHalalsByCommandId,
  createHalal,
  updateHalal,
  deleteHalal,
  getColumnNamesAndTypes,
  addHalalColumn,
  updateHalalColumn,
  updateHalalSelectColumn,
  replaceColumnValue,
  // deleteHalalSelectColumn,
  deleteHalalColumn,
};
