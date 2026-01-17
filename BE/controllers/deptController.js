const mongoose = require("mongoose");
const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ USER:", req.user);
  const { name, orgId } = req.body;
  try {
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Department name is required!" });
    }
    if (!orgId) {
      return res
        .status(400)
        .json({ success: false, message: "Organization Id is required!" });
    }

    const existingDept = await Department.findOne({
      name,
      organizationId: orgId,
    });
    if (existingDept) {
      return res.status(409).json({
        success: false,
        message: "Department with the same name already exists!",
      });
    }
    const newDept = new Department({
      name,
      organizationId: orgId,
      createdBy: req.user.userId,
    });
    const result = await newDept.save();
    return res
      .status(201)
      .json({ success: true, message: "Department has been created!", result });
  } catch (error) {
    console.error("Create dept error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  const { deptId } = req.body;
  if (!deptId) {
    return res
      .status(401)
      .json({ success: false, message: "Department ID is required!" });
  }
  try {
    const result = await Department.deleteOne({ _id: deptId });
    return res.status(201).json({
      success: true,
      message: "Department has been deleted",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ success: true, message: "Server error" });
  }
};

exports.editDepartment = async (req, res) => {
  const { deptId, name } = req.body;
  if (!deptId) {
    return res
      .status(401)
      .json({ success: false, message: "Department ID is required!" });
  }
  try {
    const result = await Department.findOneAndUpdate(
      { _id: deptId },
      { name: name },
      { new: true }
    );
    return res
      .status(201)
      .json({ success: true, message: "Department has been edited!", result });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ success: true, message: "Server error" });
  }
};

exports.getDeptsInOrg = async (req, res) => {
  const { orgId } = req.query;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization Id is required" });
  }
  const result = await Department.find({ organizationId: orgId });
  if (!result) {
    return res.status(400).json({
      success: false,
      message: "No departments were found in the organization",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Departments fetched succesfully",
    result,
  });
};
