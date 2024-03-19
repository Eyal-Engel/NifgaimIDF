const express = require("express");

const enumsControllers = require("../controllers/enumsControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.get("/", enumsControllers.getAllEnums);

router.get(
  "/enumsByHalalColumnName/:halalColumnName",
  enumsControllers.getAllEnumsByHalalColumnName
);

router.get("/:enumId", enumsControllers.getEnumById);

// router.use(checkAuth);

router.post("/", enumsControllers.createEnum);

router.patch(
  "/enumsByHalalColumnName/:halalColumnName",
  enumsControllers.updateEnumById
);

router.delete("/:enumId", enumsControllers.deleteEnumById);

router.delete(
  "/enumsByHalalColumnName/:halalColumnName",
  enumsControllers.deleteEnumsByHalalColumnName
);

module.exports = router;
