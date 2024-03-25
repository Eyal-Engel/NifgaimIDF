const express = require("express");

const halalsCotnrollers = require("../controllers/halalsCotnrollers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

// router.use(checkAuth);

router.get("/", halalsCotnrollers.getHalals);

router.get("/originalColumns", halalsCotnrollers.getOriginalColumns);

router.get("/columnEnums/:columnName", halalsCotnrollers.getEnumsForColumn);

router.get(
  "/byPrivateNumber/:privateNumber",
  halalsCotnrollers.getHalalByPrivateNumber
);

router.get("/byCommand/:commandId", halalsCotnrollers.getHalalsByCommandId);

router.get(
  "/soldierAccompanieds/:halalId",
  halalsCotnrollers.getSoldierAccompaniedsByHalalId
);

router.get("/leftOvers/:halalId", halalsCotnrollers.getLeftOversByHalalId);

router.get("/:halalId", halalsCotnrollers.getHalalById);

router.post("/", halalsCotnrollers.createHalal);

router.patch("/:halalId", halalsCotnrollers.updateHalal);

router.delete("/:halalId", halalsCotnrollers.deleteHalal);

router.get("/columns/names", halalsCotnrollers.getColumnNamesAndTypes);

router.post("/columns/add", halalsCotnrollers.addHalalColumn);

// columnName will be in body
router.patch(
  "/columns/update/select",
  halalsCotnrollers.updateHalalSelectColumn
);

// columnName will be in body
router.patch("/columns/update", halalsCotnrollers.updateHalalColumn);

router.delete("/columns/delete", halalsCotnrollers.deleteHalalColumn);

// columnName will be in body
router.patch("/columns/replaceColumnValue", halalsCotnrollers.replaceColumnValue);

// New route to reset all values in a specified column to their default values
router.patch("/columns/resetValue", halalsCotnrollers.resetColumnToDefault);

module.exports = router;
