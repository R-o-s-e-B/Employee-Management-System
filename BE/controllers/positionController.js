const Department = require("../models/Department");
const Organization = require("../models/Organization");
const Position = require("../models/Position");

exports.getPositionsByOrg = async (req, res) => {
  const { orgId } = req.query;
  if (!orgId) {
    return res.status(400).json({
      success: false,
      message: "Organization ID is not provided",
    });
  }

  try {
    const result = await Position.find({ organizationId: orgId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No positions were found for the provided organization",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Positions fetched successfully",
      result,
    });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "Internal server error", err });
  }
};

exports.createPosition = async (req, res) => {
  const { name, orgId, deptId } = req.body;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization Id is not provided" });
  }

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Position name was not provided" });
  }

  const orgExists = await Organization.exists({ orgId });
  if (!orgExists) {
    return res
      .status(404)
      .json({ success: false, message: "Organization Id provided is invalid" });
  }
  if (deptId) {
    deptExists = await Department.exists({ deptId });
    if (!deptExists) {
      return res
        .status(404)
        .json({ success: false, message: "Department ID provided is invalid" });
    }
  }

  try {
    const newPosition = new Position({
      name,
      organizationId: orgId,
      departmentId: deptId,
    });

    const result = await newPosition.save();
    return res
      .status(200)
      .json({ success: true, message: "Position added successfully!", result });
  } catch (err) {
    return res.status(501).json({ success: false, message: "Server error" });
  }
};

exports.deletePosition = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Position Id was not provided" });
  }

  try {
    const result = await Position.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Position has been deleted successfully",
      result,
    });
  } catch (err) {
    return res.status(501).json({ success: false, message: "Server error" });
  }
};
