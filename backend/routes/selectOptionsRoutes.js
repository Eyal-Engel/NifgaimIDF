const express = require("express");

const selectOptionsControllers = require("../controllers/selectOptionsControllers");

const router = express.Router();

// const checkAuth = require("../middlewares/checkAuth");

router.get("/", selectOptionsControllers.getAllOptions);

router.get(
  "/optionsByColumnName",
  selectOptionsControllers.getAllOptionsByColumnName
);

router.get("/:optionId", selectOptionsControllers.getOptionsById);

// router.use(checkAuth);

router.post("/", selectOptionsControllers.createOption);

router.patch("/:optionId", selectOptionsControllers.updateOption);

router.delete("/:optionId", selectOptionsControllers.deleteOption);
router.delete(
  "/deleteAllOptionsByColumnName",
  selectOptionsControllers.deleteAllOptionsByColumnName
);

module.exports = router;
