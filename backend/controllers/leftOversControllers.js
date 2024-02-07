const { validationResult } = require("express-validator");
const LeftOver = require("../models/schemas/NifgaimLeftOver");
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

const createLeftOver = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  const id = uuidv4();

  const {
    fullName,
    proximity,
    city,
    address,
    phone,
    comments,
    isReligious,
    nifgaimHalalId,
  } = req.body;

  try {
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
  const { fullName, proximity, city, address, phone, comments, isReligious } =
    req.body;

  try {
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
  try {
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
