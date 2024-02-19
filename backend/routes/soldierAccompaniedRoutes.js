const express = require("express");

const soldierAccompaniedControllers = require("../controllers/soldierAccompaniedControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.use(checkAuth);

router.get("/", soldierAccompaniedControllers.getSoldierAccompanieds);

router.get(
  "/:soldierAccompaniedId",
  soldierAccompaniedControllers.getSoldierAccompaniedById
);

router.get(
  "/byHalal/:halalId",
  soldierAccompaniedControllers.getSoldierAccompaniedsByHalalId
);

router.post("/", soldierAccompaniedControllers.createSoldierAccompanied);

router.patch(
  "/:soldierAccompaniedId",
  soldierAccompaniedControllers.updateSoldierAccompanied
);

router.delete(
  "/:soldierAccompaniedId",
  soldierAccompaniedControllers.deleteSoldierAccompanied
);

module.exports = router;
