const express = require("express");

const leftOversControllers = require("../controllers/leftOversControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.use(checkAuth);

router.get("/", leftOversControllers.getLeftOvers);

router.get("/:leftOverId", leftOversControllers.getLeftOverById);

router.get("/byHalal/:halalId", leftOversControllers.getLeftOversByHalalId);

router.post("/", leftOversControllers.createLeftOver);

router.patch("/:leftOverId", leftOversControllers.updateLeftOver);

router.delete("/:leftOverId", leftOversControllers.deleteLeftOver);

module.exports = router;
