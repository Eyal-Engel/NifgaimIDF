const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sha256 = require("js-sha256");
require("dotenv").config();

const User = require("../models/schemas/NifgaimUser");

// for manage users page
const getUsers = async (req, res, next) => {
  try {
    const Users = await User.findAll({});

    res.json(Users);
  } catch (err) {
    const error = new Error("Get all users failed.", 500);

    console.log(err);
    next(error);
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
    const error = new Error(`Get user by ID ${userId} failed.`, 500);

    console.error(err);
    next(error);
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

  const { privateNumber, fullName, password, commandId, isAdmin } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      where: { privateNumber },
    });
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new Error("User exists already, please login instead.", 422);
    return next(error);
  }

  try {
    const newUser = await User.create({
      id,
      privateNumber,
      fullName,
      password,
      commandId,
      isAdmin,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.log("Validation errors:", err.errors);
    const error = new Error("Signing up failed, please try again later.", 500);
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { privateNumber, passwordLogin } = req.body;

  console.log(privateNumber);
  console.log(passwordLogin);

  const secretKey = process.env.SECRET_KEY;

  let existingUser;

  try {
    existingUser = await User.findOne({
      where: { privateNumber: privateNumber },
    });
  } catch (err) {
    const error = new Error("Logging in failed, please try again later.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new Error("Invalid credentials, could not log you in.", 404);
    return next(error);
  }

  let isValidPassword = false;
  try {
    const hashedPassowrd = await sha256(passwordLogin);

    isValidPassword = hashedPassowrd === existingUser.password;
    console.log(isValidPassword);
  } catch (err) {
    const error = new Error(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new Error("Invalid credentials1, could not log you in.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, privateNumber: existingUser.privateNumber },
      secretKey,
      { expiresIn: "168h" }
    );
  } catch (err) {
    const error = new Error("Logging in failed, please try again later.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    privateNumber: existingUser.privateNumber,
    token: token,
  });
};

const updateUser = async (req, res, next) => {
  const userId = req.params.userId;

  const { privateNumber, fullName, commandId } = req.body;

  try {
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

    // Update the user fields
    if (privateNumber !== undefined) {
      user.privateNumber = privateNumber;
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (commandId !== undefined) {
      user.commandId = commandId;
    }
    // Save the updated user
    await user.save();

    // Return the updated user
    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    // Handle errors
    console.error(err);
    const error = new Error(
      `Could not update user ${userId}, please try again later.`,
      500
    );
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("failed to delete user, try later.", 422);
    }

    const userId = req.params.userId;

    let userById;
    try {
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
  } catch (error) {
    next(error); // Send the error to the error-handling middleware
  }
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.login = login;
exports.signup = signup;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
