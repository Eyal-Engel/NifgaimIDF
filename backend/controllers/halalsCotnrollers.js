const { validationResult } = require("express-validator");
const Halal = require("../models/schemas/NifgaimHalal");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes } = require("sequelize");
const db = require("../dbConfig");
const sequelize = require("../dbConfig");

const getColumnNamesAndTypes = async (req, res, next) => {
  try {
    let columns = [];
    for (let key in Halal.rawAttributes) {
      const type = Halal.rawAttributes[key].type.key;
      columns.push({ key, type });
    }

    console.log(columns);

    res.json(columns);
  } catch (error) {
    return next(error);
  }
};
const addHalalColumn = async (req, res, next) => {
  try {
    const { columnName, dataType } = req.body;

    if (!columnName || !dataType) {
      return res
        .status(400)
        .json({ message: "Column name and data type are required." });
    }

    // Get the queryInterface from your Sequelize instance
    const queryInterface = sequelize.getQueryInterface();

    // Check if the table exists
    const tableExists =
      await queryInterface.sequelize.queryInterface.showAllTables();

    console.log(tableExists);
    if (!tableExists.includes("nifgaimHalals")) {
      return res
        .status(400)
        .json({ message: "Table 'NifgaimHalals' does not exist." });
    }

    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable(
      "nifgaimHalals"
    );
    if (columnName in tableDescription) {
      return res
        .status(400)
        .json({ message: `Column '${columnName}' already exists.` });
    }

    // Define the migration code to add the new column
    await queryInterface.addColumn(
      "nifgaimHalals", // Your model's table name
      columnName, // Name of the new column
      {
        type: sequelize.Sequelize.DataTypes[dataType], // Data type of the new column
        allowNull: true, // or false based on your requirement
        defaultValue: "",
      }
    );

    console.log("New column added successfully.");

    res.status(200).json({ message: "New column added successfully." });
  } catch (error) {
    console.error("Error adding column:", error);
    return next(error);
  }
};

// const addHalalColumn = async (req, res, next) => {
//   const { columnName, columnType } = req.body;
//   try {
//     // Add column using Sequelize query
//     await db.query(
//       `ALTER TABLE Halal ADD COLUMN "${columnName}" ${columnType}`
//     );
//     res
//       .status(200)
//       .json({
//         message: `Added column ${columnName} (${columnType}) to Halal table`,
//       });
//   } catch (err) {
//     return next(err);
//   }
// };

// const updateHalalColumn = async (req, res, next) => {
//   const { columnName } = req.params;
//   const { newName, newType } = req.body;
//   try {
//     // Alter column name and type using Sequelize query
//     await db.query(
//       `ALTER TABLE Halal RENAME COLUMN "${columnName}" TO "${newName}"`
//     );
//     await db.query(
//       `ALTER TABLE Halal ALTER COLUMN "${newName}" TYPE ${newType}`
//     );
//     res.status(200).json({
//       message: `Updated column ${columnName} to ${newName} (${newType})`,
//     });
//   } catch (err) {
//     return next(err);
//   }
// };

// const deleteHalalColumn = async (req, res, next) => {
//   const { columnName } = req.params;
//   try {
//     // Drop column using Sequelize query
//     await db.query(`ALTER TABLE Halal DROP COLUMN "${columnName}"`);
//     res
//       .status(200)
//       .json({ message: `Deleted column ${columnName} from Halal table` });
//   } catch (err) {
//     return next(err);
//   }
// };

const getHalals = async (req, res, next) => {
  try {
    const halals = await Halal.findAll({});
    res.json(halals);
  } catch (err) {
    return next(err);
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
  getHalalById,
  getHalalsByCommandId,
  createHalal,
  updateHalal,
  deleteHalal,
  getColumnNamesAndTypes,
  addHalalColumn,
  // updateHalalColumn,
  // deleteHalalColumn,
};
