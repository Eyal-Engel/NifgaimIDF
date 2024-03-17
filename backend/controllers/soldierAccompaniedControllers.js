const { validationResult } = require("express-validator");
const SoldierAccompanied = require("../models/schemas/NifgaimSoldierAccompanied");
const User = require("../models/schemas/NifgaimUser");
const { v4: uuidv4 } = require("uuid");

const getSoldierAccompanieds = async (req, res, next) => {
  try {
    const soldierAccompanieds = await SoldierAccompanied.findAll({});
    res.json(soldierAccompanieds);
  } catch (err) {
    return next(err);
  }
};

const getSoldierAccompaniedById = async (req, res, next) => {
  const soldierAccompaniedId = req.params.soldierAccompaniedId;
  try {
    const soldierAccompanied = await SoldierAccompanied.findByPk(
      soldierAccompaniedId
    );
    if (!soldierAccompanied) {
      const error = new Error(
        `Soldier accompanied with ID ${soldierAccompaniedId} not found.`,
        404
      );
      return next(error);
    }
    res.json(soldierAccompanied);
  } catch (err) {
    return next(err);
  }
};

const getSoldierAccompaniedsByHalalId = async (req, res, next) => {
  const halalId = req.params.halalId;
  try {
    const soldierAccompanied = await SoldierAccompanied.findAll({
      where: { nifgaimHalalId: halalId },
    });
    if (!soldierAccompanied) {
      const error = new Error(
        `Soldier accompanied with Halal ID ${halalId} not found.`,
        404
      );
      return next(error);
    }
    res.json(soldierAccompanied);
  } catch (err) {
    return next(err);
  }
};

const createSoldierAccompanied = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }

  const id = uuidv4();

  const {
    fullName,
    privateNumber,
    rank,
    phone,
    unit,
    comments,
    nifgaimHalalId,
  } = req.body.soldierAccompaniedData;
  const { userId } = req.body;

  try {
    console.log(userId);
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

    const newSoldierAccompanied = await SoldierAccompanied.create({
      id,
      fullName,
      privateNumber,
      rank,
      phone,
      unit,
      comments,
      nifgaimHalalId,
    });
    res.status(201).json(newSoldierAccompanied);
  } catch (err) {
    return next(err);
  }
};

const updateSoldierAccompanied = async (req, res, next) => {
  const soldierAccompaniedId = req.params.soldierAccompaniedId;
  const {
    fullName,
    privateNumber,
    rank,
    phone,
    unit,
    comments,
    nifgaimHalalId,
  } = req.body.updatedSoldierAccompaniedData;
  const { userId } = req.body;

  try {
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

    const soldierAccompanied = await SoldierAccompanied.findByPk(
      soldierAccompaniedId
    );

    if (!soldierAccompanied) {
      const error = new Error(
        `Soldier accompanied with ID ${soldierAccompaniedId} not found.`,
        404
      );
      return next(error);
    }
    soldierAccompanied.fullName = fullName;
    soldierAccompanied.privateNumber = privateNumber;
    soldierAccompanied.rank = rank;
    soldierAccompanied.phone = phone;
    soldierAccompanied.unit = unit;
    soldierAccompanied.comments = comments;
    soldierAccompanied.nifgaimHalalId = nifgaimHalalId;
    await soldierAccompanied.save();
    res.json(soldierAccompanied);
  } catch (err) {
    return next(err);
  }
};

const deleteSoldierAccompanied = async (req, res, next) => {
  const soldierAccompaniedId = req.params.soldierAccompaniedId;
  const userId = req.body.userId;

  try {
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

    const soldierAccompanied = await SoldierAccompanied.findByPk(
      soldierAccompaniedId
    );
    if (!soldierAccompanied) {
      const error = new Error(
        `Soldier accompanied with ID ${soldierAccompaniedId} not found.`,
        404
      );
      return next(error);
    }
    await soldierAccompanied.destroy();
    res
      .status(200)
      .json({ message: `Deleted soldier accompanied ${soldierAccompaniedId}` });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getSoldierAccompanieds,
  getSoldierAccompaniedById,
  getSoldierAccompaniedsByHalalId,
  createSoldierAccompanied,
  updateSoldierAccompanied,
  deleteSoldierAccompanied,
};
