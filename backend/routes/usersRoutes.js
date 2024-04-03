const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/usersControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.get("/", usersController.getUsers);

router.get("/:userId", usersController.getUserById);

router.post("/login", usersController.login);

router.use(checkAuth);

router.post("/signup", usersController.signup);

router.patch("/:userId", usersController.updateUser);

router.patch("/password/:userId", usersController.changePassword);

router.delete("/:userId", usersController.deleteUser);

module.exports = router;
