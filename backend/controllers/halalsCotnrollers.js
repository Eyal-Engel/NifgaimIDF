const { validationResult } = require("express-validator");
const Halal = require("../models/schemas/NifgaimHalal");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes } = require("sequelize");
const db = require("../dbConfig");
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
};
