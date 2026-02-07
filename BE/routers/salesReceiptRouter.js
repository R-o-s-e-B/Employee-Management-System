const express = require("express");
const salesReceiptController = require("../controllers/SalesReceiptController");
const router = express.Router();

router.post("/", salesReceiptController.createSalesReceipt);
router.get("/:orgId", salesReceiptController.getSalesReceiptsByOrg);
router.put("/:receiptId", salesReceiptController.updateSalesReceipt);
router.delete("/:receiptId", salesReceiptController.deleteSalesReceipt);

module.exports = router;
