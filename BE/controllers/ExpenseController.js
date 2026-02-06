const Expense = require("../models/Expense");

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

  const filters = { organizationId: orgId };

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
      .populate("category")
      .populate("accountId")
      .populate("contactId");

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      err,
    });
  }
};
