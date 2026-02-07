const express = require("express");
const router = express.Router();
const itemController = require("../controllers/ItemController");

router.post("/", itemController.createItems);
router.get("/:orgId", itemController.getItems);
router.put("/:itemId", itemController.updateItem);
router.delete("/:itemId", itemController.deleteItem);

module.exports = router;
