const express = require("express");

const halalsCotnrollers = require("../controllers/halalsCotnrollers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

// router.use(checkAuth);

router.get("/", halalsCotnrollers.getHalals);

router.get("/originalColumns", halalsCotnrollers.getOriginalColumns);

router.get("/columnEnums/:columnName", halalsCotnrollers.getEnumsForColumn);

router.get("/:halalId", halalsCotnrollers.getHalalById);

router.get(
  "/byPrivateNumber/:privateNumber",
  halalsCotnrollers.getHalalByPrivateNumber
);

router.get("/byCommand/:commandId", halalsCotnrollers.getHalalsByCommandId);

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

// columnName will be in body
router.patch("/columns/replaceValue", halalsCotnrollers.replaceColumnValue);

router.delete("/columns/delete", halalsCotnrollers.deleteHalalColumn);

module.exports = router;
