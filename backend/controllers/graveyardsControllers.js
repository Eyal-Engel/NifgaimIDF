const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Graveyard = require("../models/schemas/NifgaimGraveyard");

// Get all commands
const getAllGraveyards = async (req, res, next) => {
  try {
    const graveyards = await Graveyard.findAll();
    res.json(graveyards);
  } catch (err) {
    console.error(err);
    const error = new Error("Get all graveyards failed.", 500);
    next(error);
  }
};

// Get a specific command by id
const getGraveyardById = async (req, res, next) => {
  const id = req.params.graveyardId;
  try {
    const graveyard = await Graveyard.findByPk(id);
    if (!graveyard) {
      return next(new Error(`Graveyard with id ${id} not found.`, 404));
    }
    res.json(graveyard);
  } catch (err) {
    console.error(err);
    next(new Error("Get graveyard by id failed.", 500));
  }
};

// Post new command
const createGraveyard = async (req, res, next) => {
  const { graveyardName } = req.body;
  const id = uuidv4();
  try {
    const newGraveyard = await Graveyard.create({ id, graveyardName });
    res.status(201).json(newGraveyard);
  } catch (err) {
    console.error(err);
    next(new Error("Create graveyard failed.", 500));
  }
};

// Patch a command by id
const updateGraveyardById = async (req, res, next) => {
  const id = req.params.graveyardId;
  const graveyardName = req.body.graveyardName;
  try {
    const graveyard = await Graveyard.findByPk(id);
    if (!graveyard) {
      return next(new Error(`Graveyard with id ${id} not found.`, 404));
    }

    graveyard.graveyardName = graveyardName;
    await graveyard.save();

    res.json(graveyard);
  } catch (err) {
    console.error(err);
    next(new Error("Update graveyard failed.", 500));
  }
};

// Delete command by id
const deleteGraveyardById = async (req, res, next) => {
  const id = req.params.graveyardId;
  try {
    const graveyard = await Graveyard.findByPk(id);
    if (!graveyard) {
      return next(new Error(`Graveyard with id ${id} not found.`, 404));
    }

    await graveyard.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    next(new Error("Delete graveyard failed.", 500));
  }
};

module.exports = {
  getAllGraveyards,
  getGraveyardById,
  createGraveyard,
  updateGraveyardById,
  deleteGraveyardById,
};
