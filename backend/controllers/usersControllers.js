const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sha256 = require("js-sha256");
require("dotenv").config();

const User = require("../models/schemas/NifgaimUser");
const Command = require("../models/schemas/NifgaimCommand");

// for manage users page
const getUsers = async (req, res, next) => {
  try {
    const Users = await User.findAll({});

    res.json(Users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId); // Assuming you have a model with a primary key named 'id'

    if (!user) {
      const error = new Error(`User with ID ${userId} not found.`, 404);
      return next(error);
    }

    res.json(user);
  } catch (err) {
    return next(err);
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }
  const id = uuidv4();

  console.log(req.body);
  const { privateNumber, fullName, password, commandId, editPerm, managePerm } =
    req.body.creditentials;

  const userId = req.body.userId;

  try {
    const user = await User.findByPk(userId);
    const managePermUser = user.managePerm;

    if (!user || user === null || user === undefined) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (!managePermUser) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    console.log(managePermUser);

    existingUser = await User.findOne({
      where: { privateNumber },
    });
  } catch (err) {
    return next(err);
  }

  if (existingUser) {
    const error = new Error("User exists already, please login instead.", 422);
    return next(error);
  }

  try {
    const hashedPassowrd = await sha256(password);
    const newUser = await User.create({
      id,
      privateNumber,
      fullName,
      password: hashedPassowrd,
      nifgaimCommandId: commandId,
      editPerm,
      managePerm,
    });

    res.status(201).json(newUser);
    // return res.status(201).json({ id, ...req.body.creditentials });
  } catch (err) {
    // console.log(err.original.length);
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { privateNumber, password } = req.body;

  console.log(privateNumber);
  console.log(password);

  const secretKey = process.env.SECRET_KEY;

  const hashedPassowrd = await sha256(password);

  try {
    const existingUser = await User.findOne({
      where: { privateNumber: privateNumber, password: hashedPassowrd },
    });

    if (!existingUser) {
      const error = new Error("Invalid credentials, could not log you in.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, privateNumber: existingUser.privateNumber },
        secretKey,
        { expiresIn: "168h" }
      );
    } catch (err) {
      return next(err);
    }

    res.json({
      userId: existingUser.id,
      privateNumber: existingUser.privateNumber,
      token: token,
    });
  } catch (err) {
    // If it's a known error with a specific status code, return it.
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    } else {
      // For any other error, return a generic 500 error.
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { privateNumber, fullName, nifgaimCommandId, editPerm, managePerm } =
    req.body.updatedUserData;

  const userUpdatingUserId = req.body.userUpdatingUserId;

  try {
    const userRequested = await User.findByPk(userUpdatingUserId);
    const managePermUserRequested = userRequested.managePerm;

    if (
      !userRequested ||
      userRequested === null ||
      userRequested === undefined
    ) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (!managePermUserRequested) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    // Find the user by ID
    const user = await User.findByPk(userId);

    // If user not found, return null or handle accordingly
    if (!user) {
      const error = new Error(
        `Could not update user ${userId}, user doesn't exist.`,
        403
      );
      return next(error);
    }

    const command = await Command.findByPk(userRequested.nifgaimCommandId);
    // If command not found, return null or handle accordingly
    if (!command) {
      const error = new Error(
        `Could not update user ${userId}, command ${userRequested.nifgaimCommandId} doesn't exist.`,
        403
      );
      return next(error);
    }

    // Update the user fields
    if (privateNumber !== undefined) {
      user.privateNumber = privateNumber;
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (nifgaimCommandId !== undefined) {
      user.nifgaimCommandId = nifgaimCommandId;
    }

    if (editPerm !== undefined) {
      user.editPerm = editPerm;
    }

    if (managePerm !== undefined) {
      user.managePerm = managePerm;
    }

    // Save the updated user
    await user.save();

    // Return the updated user
    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  console.log(req.body);
  const userId = req.params.userId;

  const { newPassword, userUpdatingUserId } = req.body;
  console.log(newPassword, userUpdatingUserId);
  try {
    const userRequested = await User.findByPk(userUpdatingUserId);
    const managePerm = userRequested.managePerm;

    if (
      !userRequested ||
      userRequested === null ||
      userRequested === undefined
    ) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User is not exist" }] } });
    }

    if (!managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    // Find the user by ID
    const user = await User.findByPk(userId);

    // If user not found, return null or handle accordingly
    if (!user) {
      const error = new Error(
        `Could not update user ${userId}, user doesn't exist.`,
        403
      );
      return next(error);
    }

    const hashedPassowrd = await sha256(newPassword);

    user.password = hashedPassowrd;
    // Save the updated user
    await user.save();

    // Return the updated user
    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("failed to delete user, try later.", 422);
    }

    const userId = req.params.userId;
    console.log(userId);

    let userById;
    const { userUpdatingUserId } = req.body;

    console.log(req.body);

    try {
      const userRequested = await User.findByPk(userUpdatingUserId);
      const managePerm = userRequested.managePerm;

      if (
        !userRequested ||
        userRequested === null ||
        userRequested === undefined
      ) {
        return res
          .status(404)
          .json({ body: { errors: [{ message: "User is not exist" }] } });
      }

      if (!managePerm) {
        return res
          .status(403)
          .json({ body: { errors: [{ message: "User is not authorized" }] } });
      }

      userById = await User.findOne({
        where: { id: userId },
      });
    } catch (err) {
      throw new Error("failed to get the user by id", 500);
    }

    if (!userById) {
      throw new Error("there is no user with the id", 404); // Assuming 404 is more appropriate for not found
    }

    try {
      await userById.destroy();
    } catch (err) {
      throw new Error("could not delete user", 500);
    }

    res.status(201).json({ message: `DELETE:  ${userId}` });
  } catch (err) {
    return next(err);
  }
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.login = login;
exports.signup = signup;
exports.updateUser = updateUser;
exports.changePassword = changePassword;
exports.deleteUser = deleteUser;
