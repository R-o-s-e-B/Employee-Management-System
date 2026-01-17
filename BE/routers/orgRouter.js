const express = require("express");
const orgController = require("../controllers/orgController");
const router = express.Router();

router.get("/allOrgs", orgController.getAllOrgs);
router.get("/userOrgs", orgController.getUserOrg);
router.post("/newOrg", orgController.createOrg);
router.delete("/deleteOrg", orgController.deleteOrg);

module.exports = router;
