const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Command = require("../models/schemas/NifgaimCommand");
const User = require("../models/schemas/NifgaimUser");

// Get all commands
const getAllCommands = async (req, res, next) => {
  try {
    const commands = await Command.findAll();
    res.json(commands);
  } catch (err) {
    return next(err);
  }
};

// Get a specific command by id
const getCommandById = async (req, res, next) => {
  const id = req.params.commandId;
  try {
    const command = await Command.findByPk(id);
    if (!command) {
      return next(new Error(`Command with id ${id} not found.`, 404));
    }
    res.json(command);
  } catch (err) {
    return next(err);
  }
};

// Post new command
const createCommand = async (req, res, next) => {
  const { commandName, userId, isNewSource } = req.body;

  const id = uuidv4();
  try {
    const user = await User.findByPk(userId);
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (user.nifgaimCommandId !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const newCommand = await Command.create({ id, commandName, isNewSource });

    // Return a flag indicating whether the command is related to logistics for the user
    res.status(201).json({ newCommand });
  } catch (err) {
    return next(err);
  }
};

// Patch a command by id
const updateCommandById = async (req, res, next) => {
  const { updatedCommand, userId } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (user.nifgaimCommandId !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const command = await Command.findByPk(id);

    if (!command.isNewSource) {
      return next(
        new Error(`You do not have access to edit this graveyard.`, 401)
      );
    }

    command.commandName = updatedCommand;
    await command.save();

    res.json(command);
  } catch (err) {
    return next(err);
  }
};

// Delete command by id
const deleteCommandById = async (req, res, next) => {
  const id = req.params.commandId;
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (user.nifgaimCommandId !== "חיל הלוגיסטיקה") {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const command = await Command.findByPk(id);

    if (!command.isNewSource) {
      return next(
        new Error(`You do not have access to delete this graveyard.`, 401)
      );
    }
    await command.destroy();
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllCommands,
  getCommandById,
  createCommand,
  updateCommandById,
  deleteCommandById,
};
