const Organization = require("../models/Organization");
const User = require("../models/User");

exports.createOrg = async (req, res) => {
  const { name, owner } = req.body;
  try {
    if (!name) {
      return res
        .status(401)
        .json({ success: false, message: "Organization name is required" });
    }
    const existingOrg = await Organization.findOne({ name, owner });
    if (existingOrg) {
      return res.status(401).json({
        success: false,
        message: "Organization name should be unique",
      });
    }
    const newOrg = new Organization({
      name,
      owner,
    });

    const result = await newOrg.save();
    return res.status(201).json({
      success: true,
      message: "Organization has been created",
      result,
      newOrg,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteOrg = async (req, res) => {
  const { orgId } = req.body;
  try {
    const orgToDelete = await Organization.findOne({ _id: orgId });
    if (!orgToDelete) {
      return res
        .status(401)
        .json({ success: false, message: "Organization does not exist" });
    }
    const result = await Organization.deleteOne({ _id: orgId });
    return res.status(201).json({
      success: true,
      message: "Organization has been deleted",
      result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.getAllOrgs = async (req, res) => {
  try {
    const allOrgs = await Organization.find({ owner: req.user.userId });
    return res.status(200).json({ success: true, result: allOrgs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserOrg = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("Organization");
    if (!orgId) {
      return res
        .status(401)
        .json({ success: false, message: "Organization Id is required" });
    }
    const org = await Organization.findById(user.OrganizationId);
    if (!org) {
      return res
        .status(401)
        .json({ success: false, message: "Organization not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Organization has been fetched", org });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
