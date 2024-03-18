const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const NifgaimEnum = require("../models/schemas/NifgaimEnum");
const User = require("../models/schemas/NifgaimUser");
const sequelize = require("../dbConfig");
const { QueryTypes } = require("sequelize");

// Function to check if halalColumnName exists in the output of getColumnNamesAndTypes
const isHalalColumnNameValid = async (halalColumnName) => {
  try {
    const columns = await sequelize.query(
      `SELECT column_name, data_type
       FROM information_schema.columns 
       WHERE table_name = 'nifgaimHalals';`,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(columns);

    if (!columns || columns.length === 0) {
      console.log("Columns are empty or undefined!");
      return false;
    }
    console.log(halalColumnName);
    return columns.some(
      (column) =>
        column.column_name == halalColumnName &&
        column.data_type === "USER-DEFINED"
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Get all enums
const getAllEnums = async (req, res, next) => {
  try {
    const enums = await NifgaimEnum.findAll();
    res.json(enums);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Get a specific enum by id
const getEnumById = async (req, res, next) => {
  const id = req.params.enumId;
  try {
    const nifgaimEnum = await NifgaimEnum.findByPk(id);
    if (!nifgaimEnum) {
      return next(new Error(`Enum with id ${id} not found.`, 404));
    }
    res.json(nifgaimEnum);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Get all enums by halalColumnName
const getAllEnumsByHalalColumnName = async (req, res, next) => {
  const halalColumnName = req.params.halalColumnName;
  try {
    const enums = await NifgaimEnum.findAll({ where: { halalColumnName } });
    res.json(enums);
  } catch (err) {
    return next(err);
  }
};

// Create a new enum with validation
const createEnum = async (req, res, next) => {
  const { halalColumnName, value } = req.body.enumData;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    const editPerm = user.editPerm;
    const managePerm = user.managePerm;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (editPerm === false && managePerm === false) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    // Check if halalColumnName exists
    const isValid = await isHalalColumnNameValid(halalColumnName);

    console.log(isValid);

    if (!isValid) {
      console.log(`HalalColumnName '${halalColumnName}' is not valid.`);
      return next(
        new Error(`HalalColumnName '${halalColumnName}' is not valid.`, 404)
      );
    }

    console.log("checkl");

    const id = uuidv4();
    const newEnum = await NifgaimEnum.create({ id, halalColumnName, value });
    res.status(201).json({ newEnum });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Update an enum by id with validation
const updateEnumById = async (req, res, next) => {
  const { halalColumnName, value } = req.body.enumData;
  const id = req.params.enumId;

  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    const editPerm = user.editPerm;
    const managePerm = user.managePerm;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (editPerm === false && managePerm === false) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    // Check if halalColumnName exists
    const isValid = await isHalalColumnNameValid(halalColumnName);
    if (!isValid) {
      return next(
        new Error(`HalalColumnName '${halalColumnName}' does not exist.`, 404)
      );
    }

    const nifgaimEnum = await NifgaimEnum.findByPk(id);
    if (!nifgaimEnum) {
      return next(new Error(`Enum with id ${id} not found.`, 404));
    }

    nifgaimEnum.halalColumnName = halalColumnName;
    nifgaimEnum.value = value;

    await nifgaimEnum.save();
    res.json(nifgaimEnum);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Delete an enum by id with validation
const deleteEnumById = async (req, res, next) => {
  const id = req.params.enumId;

  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    const editPerm = user.editPerm;
    const managePerm = user.managePerm;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (editPerm === false && managePerm === false) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const nifgaimEnum = await NifgaimEnum.findByPk(id);
    if (!nifgaimEnum) {
      return next(new Error(`Enum with id ${id} not found.`, 404));
    }

    // Check if halalColumnName exists
    const isValid = await isHalalColumnNameValid(nifgaimEnum.halalColumnName);
    if (!isValid) {
      return next(
        new Error(
          `HalalColumnName '${nifgaimEnum.halalColumnName}' does not exist.`,
          404
        )
      );
    }

    await nifgaimEnum.destroy();
    res.status(204).end();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Delete all enums by halalColumnName with validation
const deleteEnumsByHalalColumnName = async (req, res, next) => {
  const halalColumnName = req.params.halalColumnName;
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    const editPerm = user.editPerm;
    const managePerm = user.managePerm;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (editPerm === false && managePerm === false) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    console.log("object");

    // Check if halalColumnName exists
    const isValid = await isHalalColumnNameValid(halalColumnName);
    if (!isValid) {
      return next(
        new Error(`HalalColumnName '${halalColumnName}' does not exist.`, 404)
      );
    }

    await NifgaimEnum.destroy({ where: { halalColumnName } });
    res.status(204).end();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
module.exports = {
  getAllEnums,
  getEnumById,
  createEnum,
  updateEnumById,
  deleteEnumById,
  getAllEnumsByHalalColumnName,
  deleteEnumsByHalalColumnName,
};
