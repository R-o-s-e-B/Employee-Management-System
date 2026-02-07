const express = require("express");
const expenseController = require("../controllers/ExpenseController");
const router = express.Router();

router.post("/", expenseController.createExpense);
router.get("/:orgId", expenseController.getExpensesByOrg);
router.put("/:orgId/:expenseId", expenseController.updateExpense);
router.delete("/:orgId/:expenseId", expenseController.deleteExpense);

module.exports = router;
