const express = require("express");
const accountController = require("../controllers/AccountController");
const router = express.Router();

router.post("/", accountController.createAccount);
router.get("/:orgId", accountController.getAccounts);

module.exports = router;
