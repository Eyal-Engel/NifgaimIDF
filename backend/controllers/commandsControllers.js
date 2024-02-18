const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Command = require("../models/schemas/NifgaimCommand");

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
  const { commandName } = req.body;
  const id = uuidv4();
  try {
    const newCommand = await Command.create({ id, commandName });
    res.status(201).json(newCommand);
  } catch (err) {
    return next(err);
  }
};

// Patch a command by id
const updateCommandById = async (req, res, next) => {
  const id = req.params.commandId;
  const commandName = req.body.updatedCommand;
  console.log("AAAAAAAAAAAAAAAAA");
  console.log(req);
  try {
    const command = await Command.findByPk(id);
    if (!command) {
      return next(new Error(`Command with id ${id} not found.`, 404));
    }

    command.commandName = commandName;
    await command.save();

    res.json(command);
  } catch (err) {
    return next(err);
  }
};

// Delete command by id
const deleteCommandById = async (req, res, next) => {
  const id = req.params.commandId;
  try {
    const command = await Command.findByPk(id);
    if (!command) {
      return next(new Error(`Command with id ${id} not found.`, 404));
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
