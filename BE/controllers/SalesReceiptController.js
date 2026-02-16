const SalesReceipt = require("../models/SalesReceipt");
// Import Contact model to register it with Mongoose for populate
require("../models/Contact");

exports.createSalesReceipt = async (req, res) => {
  try {
    const {
      organizationId,
      accountId,
      categoryId,
      amount,
      dateReceived,
      contactId,
      paymentMethod,
      items,
      season,
      batchId,
      notes,
      receiptUrl,
      status,
    } = req.body;

    // Required field validation
    if (
      !organizationId ||
      !accountId ||
      !categoryId ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Organization, account, category, amount and payment method are required",
      });
    }

    // Optional: auto calculate total from items
    let finalAmount = amount;

    if (items && items.length > 0) {
      finalAmount = items.reduce((total, item) => {
        const itemTotal =
          (Number(item.quantity) || 0) * (Number(item.rate) || 0);
        return total + itemTotal;
      }, 0);
    }

    const newReceipt = new SalesReceipt({
      organizationId,
      accountId,
      categoryId,
      amount: finalAmount,
      dateReceived: dateReceived || Date.now(),
      contactId: contactId || null,
      paymentMethod,
      items: items || [],
      season: season || null,
      batchId: batchId || null,
      notes: notes || null,
      receiptUrl: receiptUrl || null,
      status: status || "finalized",
    });

    const result = await newReceipt.save();

    return res.status(201).json({
      success: true,
      message: "Sales receipt created successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getSalesReceiptsByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const {
      categoryId,
      accountId,
      paymentMethod,
      season,
      fromDate,
      toDate,
      status,
    } = req.query;

    let filter = { organizationId: orgId };

    if (categoryId) filter.categoryId = categoryId;
    if (accountId) filter.accountId = accountId;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (season) filter.season = season;
    if (status) filter.status = status;

    if (fromDate || toDate) {
      filter.dateReceived = {};
      if (fromDate) filter.dateReceived.$gte = new Date(fromDate);
      if (toDate) filter.dateReceived.$lte = new Date(toDate);
    }

    const result = await SalesReceipt.find(filter)
      .populate("accountId categoryId contactId")
      .sort({ dateReceived: -1 });

    return res.status(200).json({
      success: true,
      message: "Sales receipts fetched successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateSalesReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;

    const receipt = await SalesReceipt.findById(receiptId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Sales receipt not found",
      });
    }

    if (receipt.status === "finalized") {
      return res.status(400).json({
        success: false,
        message: "Finalized receipts cannot be edited",
      });
    }

    const updated = await SalesReceipt.findByIdAndUpdate(receiptId, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Sales receipt updated successfully",
      result: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.deleteSalesReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;

    const receipt = await SalesReceipt.findById(receiptId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Sales receipt not found",
      });
    }

    if (receipt.status === "finalized") {
      return res.status(400).json({
        success: false,
        message: "Finalized receipts cannot be deleted",
      });
    }

    await SalesReceipt.findByIdAndDelete(receiptId);

    return res.status(200).json({
      success: true,
      message: "Sales receipt deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
