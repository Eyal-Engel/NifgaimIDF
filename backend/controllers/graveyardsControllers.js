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
    return next(err);
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
    return next(err);
  }
};

// Post new command
const createGraveyard = async (req, res, next) => {
  const { graveyardName, isNewSource } = req.body;
  const id = uuidv4();
  try {
    const newGraveyard = await Graveyard.create({
      id,
      graveyardName,
      isNewSource,
    });
    res.status(201).json(newGraveyard);
  } catch (err) {
    return next(err);
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

    if (graveyard.isNewSource) {
      return next(
        new Error(`You do not have access to edit this graveyard.`, 401)
      );
    }

    graveyard.graveyardName = graveyardName;
    await graveyard.save();

    res.json(graveyard);
  } catch (err) {
    return next(err);
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

    // command this to delete a source graveyard
    if (graveyard.isNewSource) {
      return next(
        new Error(`You do not have access to delete this graveyard.`, 401)
      );
    }

    await graveyard.destroy();
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllGraveyards,
  getGraveyardById,
  createGraveyard,
  updateGraveyardById,
  deleteGraveyardById,
};
