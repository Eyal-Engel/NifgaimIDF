const express = require("express");

const commandsController = require("../controllers/commandsControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.get("/", commandsController.getAllCommands);

router.get("/:commandId", commandsController.getCommandById);

// router.use(checkAuth);

router.post("/", commandsController.createCommand);

router.patch("/:commandId", commandsController.updateCommandById);

router.delete("/:commandId", commandsController.deleteCommandById);

module.exports = router;
