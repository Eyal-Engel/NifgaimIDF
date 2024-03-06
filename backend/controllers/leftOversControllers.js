const { validationResult } = require("express-validator");
const LeftOver = require("../models/schemas/NifgaimLeftOver");
const User = require("../models/schemas/NifgaimUser");
const Command = require("../models/schemas/NifgaimCommand");
const { v4: uuidv4 } = require("uuid");

const getLeftOvers = async (req, res, next) => {
  try {
    const leftOvers = await LeftOver.findAll({});
    res.json(leftOvers);
  } catch (err) {
    return next(err);
  }
};

const getLeftOverById = async (req, res, next) => {
  const leftOverId = req.params.leftOverId;
  try {
    const leftOver = await LeftOver.findByPk(leftOverId);
    if (!leftOver) {
      const error = new Error(
        `Left over with ID ${leftOverId} not found.`,
        404
      );
      return next(error);
    }
    res.json(leftOver);
  } catch (err) {
    return next(err);
  }
};

const getLeftOversByHalalId = async (req, res, next) => {
  const halalId = req.params.halalId;
  try {
    const leftOvers = await LeftOver.findAll({
      where: { nifgaimHalalId: halalId },
    });
    res.json(leftOvers);
  } catch (err) {
    return next(err);
  }
};

// {
//   userId: 'd1e47f3e-b767-4030-b6ab-21bec850ba48',
//   leftOverData: {
//     fullName: '9630147',
//     nifgaimHalalId: '69017620-49f2-40b0-8648-e2b981df90e7',
//     proximity: 'אמא',
//     city: 'עיר',
//     address: 'כתובת',
//     phone: '+972 50 299 6949',
//     isReligious: 'true',
//     comments: 'אין העורת'
//   }
const createLeftOver = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  const id = uuidv4();

  console.log(req.body);
  const {
    fullName,
    proximity,
    city,
    address,
    phone,
    comments,
    isReligious,
    nifgaimHalalId,
  } = req.body.leftOverData;
  const { userId } = req.body;

  try {
    console.log(userId);
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

    const newLeftOver = await LeftOver.create({
      id,
      fullName,
      proximity,
      city,
      address,
      phone,
      comments,
      isReligious,
      nifgaimHalalId,
    });
    res.status(201).json(newLeftOver);
  } catch (err) {
    return next(err);
  }
};

const updateLeftOver = async (req, res, next) => {
  const leftOverId = req.params.leftOverId;
  const {
    fullName,
    proximity,
    city,
    address,
    phone,
    comments,
    isReligious,
    userId,
  } = req.body;

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

    const leftOver = await LeftOver.findByPk(leftOverId);
    if (!leftOver) {
      const error = new Error(
        `Left over with ID ${leftOverId} not found.`,
        404
      );
      return next(error);
    }
    leftOver.fullName = fullName;
    leftOver.proximity = proximity;
    leftOver.city = city;
    leftOver.address = address;
    leftOver.phone = phone;
    leftOver.comments = comments;
    leftOver.isReligious = isReligious;
    await leftOver.save();
    res.json(leftOver);
  } catch (err) {
    return next(err);
  }
};

const deleteLeftOver = async (req, res, next) => {
  const leftOverId = req.params.leftOverId;
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

    const leftOver = await LeftOver.findByPk(leftOverId);
    if (!leftOver) {
      const error = new Error(
        `Left over with ID ${leftOverId} not found.`,
        404
      );
      return next(error);
    }
    await leftOver.destroy();
    res.status(200).json({ message: `Deleted left over ${leftOverId}` });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getLeftOvers,
  getLeftOverById,
  getLeftOversByHalalId,
  createLeftOver,
  updateLeftOver,
  deleteLeftOver,
};
