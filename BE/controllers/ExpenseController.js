const Expense = require("../models/Expense");
const mongoose = require("mongoose");
// Import Contact model to register it with Mongoose for populate
require("../models/Contact");

exports.createExpense = async (req, res) => {
  const {
    orgId,
    accountId,
    amount,
    category,
    date,
    contactId,
    zone,
    items,
    paymentMethod,
    notes,
    billUrl,
  } = req.body;

  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Account Id is required" });
  }

  if (!accountId) {
    return res
      .status(400)
      .json({ success: false, message: "Account Id is required" });
  }

  if (!amount) {
    return res
      .status(400)
      .json({ success: false, message: "Amount is required" });
  }

  if (!category) {
    return res
      .status(400)
      .json({ success: false, message: "Category is required" });
  }

  try {
    const newExpense = new Expense({
      organizationId: orgId,
      accountId: accountId,
      category: category,
      amount: amount,
      date,
      contactId: contactId ? contactId : null,
      zone: zone ? zone : null,
      items: Array.isArray(items) && items.length > 0 ? items : [],
      paymentMethod: paymentMethod ? paymentMethod : null,
      notes: notes ? notes : null,
      billUrl: billUrl ? billUrl : null,
    });

    const result = await newExpense.save();
    return res
      .status(200)
      .json({ success: true, message: "Expense added", result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.getExpensesByOrg = async (req, res) => {
  const { orgId } = req.params;
  const { category, accountId, fromDate, toDate } = req.query;

  if (!orgId) {
    return res.status(400).json({
      success: false,
      message: "Org Id is required",
    });
  }

  // Validate orgId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(orgId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Organization ID format",
    });
  }

  const filters = { organizationId: orgId, isDeleted: false };

  if (category) filters.category = category;
  if (accountId) filters.accountId = accountId;

  if (fromDate || toDate) {
    filters.date = {};
    if (fromDate) filters.date.$gte = new Date(fromDate);
    if (toDate) filters.date.$lte = new Date(toDate);
  }

  try {
    const result = await Expense.find(filters)
      .sort({ date: -1 })
      .populate({
        path: "category",
        select: "name type",
        options: { strictPopulate: false },
      })
      .populate({
        path: "accountId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "contactId",
        select: "firstName lastName",
        options: { strictPopulate: false },
      });

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      result,
    });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    console.error("Error stack:", err.stack);
    console.error("Error name:", err.name);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
      error: err.message || err.toString(),
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { orgId, expenseId } = req.params;
    const {
      accountId,
      amount,
      category,
      date,
      contactId,
      zone,
      items,
      paymentMethod,
      notes,
      billUrl,
    } = req.body;

    if (!orgId || !expenseId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Expense ID are required",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      organizationId: orgId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Update only provided fields
    if (accountId) expense.accountId = accountId;
    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (contactId !== undefined) expense.contactId = contactId;
    if (zone !== undefined) expense.zone = zone;
    if (Array.isArray(items)) expense.items = items;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;
    if (billUrl !== undefined) expense.billUrl = billUrl;

    const result = await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating expense",
      error: err.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId, orgId } = req.params;

    if (!orgId || !expenseId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Expense ID are required",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      organizationId: orgId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    expense.isDeleted = true;
    await Expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting expense",
      error: err.message,
    });
  }
};
