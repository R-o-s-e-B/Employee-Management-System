const Account = require("../models/Account");

exports.getAccounts = async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization Id is required" });
  }
  try {
    const result = await Account.find({ organizationId: orgId });
    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Accounts found for the organization",
        result: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Accounts fetched successfully",
      result,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.createAccount = async (req, res) => {
  const { name, orgId } = req.body;
  const userId = req.user.userId;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization Id is required" });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id not found" });
  }

  try {
    const newAccount = new Account({
      organizationId: orgId,
      name: name,
      createdBy: userId,
    });

    const result = await newAccount.save();

    return res
      .status(200)
      .json({ success: true, message: "New A ccount added", result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};
