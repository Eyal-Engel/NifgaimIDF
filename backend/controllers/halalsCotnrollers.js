const { validationResult } = require("express-validator");
const Halal = require("../models/schemas/NifgaimHalal");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Sequelize } = require("sequelize");
const sequelize = require("../dbConfig");

const getHalals = async (req, res, next) => {
  try {
    const halals = await Halal.findAll({});
    res.json(halals);
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

const addHalalColumn = async (req, res, next) => {
  try {
    const { columnName, dataType, defaultValue } = req.body;

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

    // Validate the default value for the specified data type
    if (!isValidDefaultValue(dataType, defaultValue)) {
      return res.status(400).json({
        message: `Default value '${defaultValue}' is not valid for data type '${dataType}'.`,
      });
    }

    // Define the migration code to add the new column
    await queryInterface.addColumn(
      "nifgaimHalals", // Your model's table name
      columnName, // Name of the new column
      {
        type: sequelize.Sequelize.DataTypes[dataType], // Data type of the new column
        allowNull: true, // or false based on your requirement
        defaultValue: defaultValue || null,
      }
    );

    console.log("New column added successfully.");

    res.status(200).json({ message: "New column added successfully." });
  } catch (error) {
    console.error("Error adding column:", error);
    return next(error);
  }
};

// Function to validate default value based on data type
function isValidDefaultValue(dataType, defaultValue) {
  return typeof defaultValue === dataType || defaultValue === null;
}

const updateHalalColumn = async (req, res, next) => {
  try {
    const { columnName } = req.params;
    const { newColumnName } = req.body;

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

    // Rename the column
    await queryInterface.renameColumn(
      "nifgaimHalals", // Your model's table name
      columnName, // Current name of the column
      newColumnName // New name for the column
    );

    console.log("Column name updated successfully.");

    res.status(200).json({ message: "Column name updated successfully." });
  } catch (error) {
    console.error("Error updating column name:", error);
    return next(error);
  }
};

const deleteHalalColumn = async (req, res, next) => {
  try {
    const { columnName } = req.params;

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
  getHalalById,
  getHalalsByCommandId,
  createHalal,
  updateHalal,
  deleteHalal,
  getColumnNamesAndTypes,
  addHalalColumn,
  updateHalalColumn,
  deleteHalalColumn,
};
