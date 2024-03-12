const { validationResult } = require("express-validator");
const Halal = require("../models/schemas/NifgaimHalal");
const User = require("../models/schemas/NifgaimUser");
const Command = require("../models/schemas/NifgaimCommand");
const SoldierAccompanied = require("../models/schemas/NifgaimSoldierAccompanied");
const LeftOver = require("../models/schemas/NifgaimLeftOver");

const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Sequelize, Op } = require("sequelize");
const sequelize = require("../dbConfig");

const getHalals = async (req, res, next) => {
  try {
    // Get all column names dynamically
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'nifgaimHalals';`,
      { type: QueryTypes.SELECT }
    );

    // Extract column names from the query result
    const columnNames = columns.map((column) => column.column_name);

    // Fetch all halals with all columns
    const halals = await Halal.findAll({
      attributes: columnNames, // Fetch all columns dynamically
    });

    res.json(halals);
  } catch (err) {
    return next(err);
  }
};

const getHalalByPrivateNumber = async (req, res, next) => {
  try {
    const { privateNumber } = req.params;

    // Check if the private number is provided
    if (!privateNumber) {
      return res.status(400).json({ message: "Private number is required." });
    }

    // Find the halal by private number
    const halal = await Halal.findOne({ where: { privateNumber } });

    // If halal is not found, return 404 status
    if (!halal) {
      return res.status(404).json({ message: "Halal not found." });
    }

    // If halal is found, return it
    res.json(halal);
  } catch (err) {
    // Handle errors
    return next(err);
  }
};

const getSoldierAccompaniedsByHalalId = async (req, res, next) => {
  const nifgaimHalalId = req.params.halalId;
  try {
    // Find all SoldierAccompanied instances related to the Halal instance
    const soldierAccompanieds = await SoldierAccompanied.findAll({
      where: { nifgaimHalalId },
    });
    res.json(soldierAccompanieds);
  } catch (err) {
    return next(err);
  }
};

const getLeftOversByHalalId = async (req, res, next) => {
  const nifgaimHalalId = req.params.halalId;
  try {
    // Find all LeftOver instances related to the Halal instance
    const leftOvers = await LeftOver.findAll({
      where: { nifgaimHalalId },
    });
    res.json(leftOvers);
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

const getEnumsForColumn = async (req, res, next) => {
  const { columnName } = req.params;
  console.log(columnName);
  try {
    // Check if the column exists
    const columns = await sequelize.query(
      `SELECT format_type(a.atttypid, NULL) AS enum_name, array_agg(e.enumlabel) AS enum_values
       FROM pg_attribute a
       JOIN pg_type t ON a.atttypid = t.oid
       JOIN pg_enum e ON t.oid = e.enumtypid
       JOIN pg_namespace n ON t.typnamespace = n.oid
       WHERE n.nspname = 'public' AND a.attname = $columnName
       GROUP BY enum_name;`,
      {
        type: QueryTypes.SELECT,
        bind: { columnName },
      }
    );

    if (columns.length === 0) {
      return res.status(400).json({
        message: `Column '${columnName}' does not exist or is not of type ENUM.`,
      });
    }

    const enumValues = columns[0].enum_values;

    res.json(enumValues);
  } catch (err) {
    return next(err);
  }
};

// expected input to addHalalColumn
// {
//   "columnName": "example_column",
//    "dataType":"select: [value1, value2, value3]",
//   "defaultValue": "value1",
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }

// const addHalalColumn = async (req, res, next) => {
//   try {
//     const { columnName, dataType, defaultValue } = req.body;
//     const { userId } = req.body;
//     const userRequested = await User.findByPk(userId);
//     const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
//     const userCommandName = userCommand.commandName;
//     let defaultValuePost = defaultValue;

//     console.log(userId, columnName, dataType, defaultValue);
//     console.log(defaultValue);
//     if (
//       !userRequested ||
//       userRequested === null ||
//       userRequested === undefined
//     ) {
//       return res
//         .status(404)
//         .json({ body: { errors: [{ message: "User does not exist" }] } });
//     }

//     if (userCommandName !== "חיל הלוגיסטיקה") {
//       return res
//         .status(403)
//         .json({ body: { errors: [{ message: "User is not authorized" }] } });
//     }

//     if (!columnName || !dataType) {
//       return res.status(400).json({
//         body: {
//           errors: [{ message: "Column name and data type are required." }],
//         },
//       });
//     }

//     if (defaultValuePost === undefined) {
//       defaultValuePost = null;
//     }

//     // Get the queryInterface from your Sequelize instance
//     const queryInterface = sequelize.getQueryInterface();

//     // Check if the table exists
//     const tableExists =
//       await queryInterface.sequelize.queryInterface.showAllTables();

//     if (!tableExists.includes("nifgaimHalals")) {
//       return res.status(400).json({
//         body: {
//           errors: [{ message: "Table 'NifgaimHalals' does not exist." }],
//         },
//       });
//     }

//     // Check if the column already exists
//     const tableDescription = await queryInterface.describeTable(
//       "nifgaimHalals"
//     );
//     if (columnName in tableDescription) {
//       return res.status(400).json({
//         body: {
//           errors: [{ message: `Column '${columnName}' already exists.` }],
//         },
//       });
//     }

//     // Validate the default value for the specified data type
//     if (dataType.startsWith("select: ")) {
//       const enumValues = dataType
//         .substring(8)
//         .slice(1, -1)
//         .split(", ")
//         .map((value) => value.trim()); // Remove leading and trailing whitespace
//       if (!enumValues.includes(defaultValuePost)) {
//         return res.status(400).json({
//           body: {
//             errors: [
//               {
//                 message: `Default value '${defaultValuePost}' is not valid for data type '${dataType}'.`,
//               },
//             ],
//           },
//         });
//       }
//     } else if (!isValidDefaultValue(dataType, defaultValuePost)) {
//       return res.status(400).json({
//         body: {
//           errors: [
//             {
//               message: `Default value '${defaultValuePost}' is not valid for data type '${dataType}'.`,
//             },
//           ],
//         },
//       });
//     }
//     // Define the migration code to add the new column
//     await queryInterface.addColumn(
//       "nifgaimHalals", // Your model's table name
//       columnName, // Name of the new column
//       {
//         type: dataType.startsWith("select: ")
//           ? sequelize.Sequelize.ENUM(
//               ...dataType.substring(8).slice(1, -1).split(", ")
//             )
//           : sequelize.Sequelize.DataTypes[dataType], // Data type of the new column
//         allowNull: true, // or false based on your requirement
//         defaultValue: defaultValuePost || null,
//       }
//     );

//     console.log("New column added successfully.");

//     res.status(200).json({ message: "New column added successfully." });
//   } catch (error) {
//     console.error("Error adding column:", error);
//     return next(error);
//   }
// };

const addHalalColumn = async (req, res, next) => {
  try {
    const { columnName, dataType, defaultValue } = req.body;
    const { userId } = req.body;
    const userRequested = await User.findByPk(userId);
    const userCommand = await Command.findByPk(userRequested.nifgaimCommandId);
    const userCommandName = userCommand.commandName;
    let defaultValuePost = defaultValue;

    // Trim columnName to remove leading and trailing spaces
    const trimmedColumnName = columnName.trim();

    console.log(userId, trimmedColumnName, dataType, defaultValue);
    console.log(defaultValue);
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

    if (!trimmedColumnName || !dataType) {
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
    if (trimmedColumnName in tableDescription) {
      return res.status(400).json({
        body: {
          errors: [
            { message: `Column '${trimmedColumnName}' already exists.` },
          ],
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
      trimmedColumnName, // Name of the new column
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
//DataTypes
//dataType
//   "columnName": "sect",
//   "newColumnName": "sect",
//   "columnDefault": "WORLD",
//   "dataType": "STRING"
// }
const updateHalalColumn = async (req, res, next) => {
  try {
    const { userId, columnName, newColumnName, columnDefault, dataType } =
      req.body;

    // Check if the dataType is valid
    const validDataTypes = [
      "STRING",
      "INTEGER",
      "BOOLEAN",
      "FLOAT",
      "DOUBLE",
      "DATE",
      "UUID",
      "ENUM",
    ];

    console.log(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
    if (!validDataTypes.includes(dataType)) {
      return res
        .status(400)
        .json({ message: `Invalid data type: ${dataType}` });
    }

    // Dynamically create the Sequelize data type based on the dataType from the request body
    const sequelizeDataType = Sequelize[dataType];

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
      console.log("new column name");
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
            type: sequelizeDataType, // Use dynamically created Sequelize data type
            defaultValue: columnDefault,

            // defaultValue: columnDefault, // New default value
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
        console.log("check default");
        console.log(columnDefault);
        console.log(typeof columnDefault);

        await queryInterface.changeColumn(
          "nifgaimHalals", // Your model's table name
          columnName, // Current name of the column
          {
            type: sequelizeDataType, // Use dynamically created Sequelize data type
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
//   "columnName": "example_column",
//   "newColumnName": "example_columnexample_column",
//   "newEnumValues": ["value1", "value2", "value4"],
//   "column_default": "value4"
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
      return res.status(400).json({
        errors: [{ message: "Table 'NifgaimHalals' does not exist." }],
      });
    }

    // Check if the column exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (!tableDescription[columnName]) {
      return res.status(400).json({
        errors: [{ message: `Column '${columnName}' does not exist.` }],
      });
    }

    // Verify if the column is of type ENUM or USER-DEFINED (custom type)
    const columnDataType = tableDescription[columnName].type;
    if (
      !(columnDataType.startsWith("ENUM") || columnDataType === "USER-DEFINED")
    ) {
      return res.status(400).json({
        errors: [
          {
            message: `Column '${columnName}' is not of type ENUM or USER-DEFINED.`,
          },
        ],
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
    // Get all column names dynamically
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'nifgaimHalals';`,
      { type: QueryTypes.SELECT }
    );

    // Extract column names from the query result
    const columnNames = columns.map((column) => column.column_name);

    // Fetch halal by ID with all columns
    const halal = await Halal.findByPk(halalId, { attributes: columnNames });

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
    // Get all column names dynamically
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'nifgaimHalals';`,
      { type: QueryTypes.SELECT }
    );

    // Extract column names from the query result
    const columnNames = columns.map((column) => column.column_name);

    // Fetch halals by command ID with all columns
    const halals = await Halal.findAll({
      where: { nifgaimCommandId: commandId },
      attributes: columnNames,
    });

    res.json(halals);
  } catch (err) {
    return next(err);
  }
};

// {
//   "privateNumber": "1010101",
//   "lastName": "Doe",
//   "firstName": "John",
//   "dateOfDeath": "2024-03-03",
//   "serviceType": "קבע",
//   "circumstances": "Combat",
//   "unit": "Alpha Company",
//   "division": "1st Division",
//   "specialCommunity": "Veterans",
//   "area": "Section A",
//   "plot": "Plot 123",
//   "line": "Line 1",
//   "graveNumber": "456",
//   "permanentRelationship": false,
//   "comments": "Lorem ipsum dolor sit.",
//   "nifgaimCommandId": "07ec94ec-d900-4633-8c40-b47f25ac6a9c",
//   "nifgaimGraveyardId": "286ad23d-450c-47c4-b23d-377ac18b993b",
//   "testing": "testy"
// }
const createHalal = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }
  const id = uuidv4();

  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    const userCommand = await Command.findByPk(user.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'nifgaimHalals';`,

      { type: QueryTypes.SELECT }
    );

    // Extract column names from the query result
    const columnNames = columns.map((column) => column.column_name);

    // Create new Halal entry with all columns
    const newHalalData = { id, ...req.body.halalData };

    // Construct SQL INSERT statement dynamically
    const insertColumns = [];
    const insertValues = [];
    const placeholders = [];
    for (const columnName in newHalalData) {
      if (columnNames.includes(columnName)) {
        insertColumns.push(`"${columnName}"`); // Quote column names
        const value = newHalalData[columnName];
        if (typeof value === "boolean") {
          // Convert boolean values to strings
          insertValues.push(value.toString());
        } else {
          insertValues.push(value);
        }
        placeholders.push("?");
      }
    }

    const insertQuery = `
    INSERT INTO "nifgaimHalals" (${insertColumns.join(", ")})
    VALUES (${placeholders.join(", ")})
  `;

    //   INSERT INTO "nifgaimHalals" (
    //     id, "privateNumber", "lastName", "firstName", "dateOfDeath",
    //     "serviceType", "circumstances", "unit", "division", "specialCommunity",
    //     "area", "plot", "line", "graveNumber", "permanentRelationship", "comments",
    //     "nifgaimCommandId", "nifgaimGraveyardId"
    // )
    // VALUES (
    //     '69017620-49f2-40b0-8648-e2b981df90e7', '1020202', 'Doe', 'John', '2024-03-03',
    //     'קבע', 'Combat', 'Alpha Company', '1st Division', 'Veterans',
    //     'Section A', 'Plot 123', 'Line 1', '456', 'false', 'Lorem ipsum dolor sit.',
    //     '07ec94ec-d900-4633-8c40-b47f25ac6a9c', '286ad23d-450c-47c4-b23d-377ac18b993b'
    // );

    try {
      // Execute the SQL INSERT statement
      await sequelize.query(insertQuery, {
        replacements: insertValues,
        type: QueryTypes.INSERT,
      });

      res.status(201).json({ id, ...req.body });
    } catch (err) {
      console.error("Error executing query createHalal:", err);
      return next(err.message);
    }
  } catch (err) {
    return next(err);
  }
};

// Function to filter out keys not present in columnNames
function filterObjectKeys(object, allowedKeys) {
  const filtered = {};
  for (const key in object) {
    if (allowedKeys.includes(key)) {
      filtered[key] = object[key];
    }
  }
  return filtered;
}

const updateHalal = async (req, res, next) => {
  const halalId = req.params.halalId;
  const { userId } = req.body;
  const requestBody = req.body.updatedHalalData;

  try {
    const user = await User.findByPk(userId);
    const userCommand = await Command.findByPk(user.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const halal = await Halal.findByPk(halalId);
    if (!halal) {
      const error = new Error(`Halal with ID ${halalId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Update all properties of the halal instance with the values from the request body
    Object.keys(requestBody).forEach((key) => {
      halal[key] = requestBody[key];
    });

    // Get all column names dynamically
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'nifgaimHalals';`,
      { type: QueryTypes.SELECT }
    );

    // Extract column names from the query result
    const columnNames = columns.map((column) => column.column_name);

    // Filter out keys not present in columnNames
    const filteredRequestData = filterObjectKeys(requestBody, columnNames);

    // Construct SQL query to update only the columns present in the filtered request data
    const updates = Object.keys(filteredRequestData).map((key) => {
      const value =
        typeof filteredRequestData[key] === "string"
          ? `'${filteredRequestData[key]}'`
          : filteredRequestData[key];
      return `"${key}" = ${value}`;
    });

    // Execute the SQL query to update the halal instance
    const updateQuery = `
      UPDATE "nifgaimHalals" 
      SET ${updates.join(", ")} 
      WHERE "id" = '${halalId}' 
      RETURNING *;
    `;

    const updatedHalal = await sequelize.query(updateQuery, {
      type: QueryTypes.UPDATE,
    });

    res.json(updatedHalal[0][0]); // Return the updated instance
  } catch (err) {
    next(err);
  }
};

const deleteHalal = async (req, res, next) => {
  const halalId = req.params.halalId;
  const userId = req.body.userId;

  try {
    const user = await User.findByPk(userId);
    const userCommand = await Command.findByPk(user.nifgaimCommandId);
    const userCommandName = userCommand.commandName;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (userCommandName !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

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
  getHalalByPrivateNumber,
  getHalalsByCommandId,
  getEnumsForColumn,
  getSoldierAccompaniedsByHalalId,
  getLeftOversByHalalId,
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
