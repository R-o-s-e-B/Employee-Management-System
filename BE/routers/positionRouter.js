const express = require("express");
const router = express.Router();
const positionController = require("../controllers/positionController");

router.get("/", positionController.getPositionsByOrg);
router.post("/", positionController.createPosition);
router.delete("/:id", positionController.deletePosition);

module.exports = router;
