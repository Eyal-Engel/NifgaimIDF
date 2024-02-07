const express = require("express");

const graveyardsControllers = require("../controllers/graveyardsControllers");

const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

router.get("/", graveyardsControllers.getAllGraveyards);

router.get("/:graveyardId", graveyardsControllers.getGraveyardById);

router.post("/", graveyardsControllers.createGraveyard);

// router.use(checkAuth);

router.patch("/:graveyardId", graveyardsControllers.updateGraveyardById);

router.delete("/:graveyardId", graveyardsControllers.deleteGraveyardById);

module.exports = router;