const express = require("express");

const halalsCotnrollers = require("../controllers/halalsCotnrollers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.use(checkAuth);

router.get("/", halalsCotnrollers.getHalals);

router.get("/:halalId", halalsCotnrollers.getHalalById);

router.get("/byCommand/:commandId", halalsCotnrollers.getHalalsByCommandId);

router.post("/", halalsCotnrollers.createHalal);

router.patch("/:halalId", halalsCotnrollers.updateHalal);

router.delete("/:halalId", halalsCotnrollers.deleteHalal);

module.exports = router;
