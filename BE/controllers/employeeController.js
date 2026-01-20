const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll");
const validStatus = require("../config");

exports.createEmployee = async (req, res) => {
  const {
    organizationId: orgId,
    departmentId: deptId,
    firstName,
    lastName,
    position,
    imageUrl,
    contactInfo,
  } = req.body;
  if (!orgId || !deptId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide OrgId and DeptId" });
  }

  const orgExists = await Organization.exists({ _id: organizationId });
  const deptExists = await Department.exists({ _id: departmentId });
  if (!orgExists || !deptExists) {
    return res.status(404).json({
      success: false,
      message: "Organization or Department not found",
    });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "Firstname and Last name are required!",
    });
  }
  try {
    const newEmployee = new Employee({
      orgId,
      deptId,
      firstName,
      lastName,
      position: position || null,
      imageUrl: imageUrl || null,
      contactInfo: contactInfo || null,
    });

    const result = await newEmployee.save();
    return res.status(201).json({
      success: true,
      message: "Employee has been added succesfully",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ success: false, message: "Server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { employeeId, orgId, departmentId } = req.body;
  if (!employeeId || !orgId || !departmentId) {
    return req.status(400).json({
      success: false,
      message: "Organization ID, employee ID or department ID is missing",
    });
  }
  const employee = Employee.findById(employeeId);
  if (!employee) {
    return req.status(400).json({
      success: false,
      message: "Employee does not exist",
    });
  }
  try {
    const result = await Employee.deleteOne({ _id: employeeId });
    return res.status(200).json({
      success: true,
      message: "Employee has been deleted successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateEmployee = async (req, res) => {
  const {
    employeeId,
    organizationId: orgId,
    departmentId: deptId,
    firstName,
    lastName,
    position,
    imageUrl,
  } = req.body;

  if (!employeeId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide employee ID" });
  }
  if (!orgId || !deptId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide OrgId and DeptId" });
  }

  const orgExists = await Organization.exists({ _id: organizationId });
  const deptExists = await Department.exists({ _id: departmentId });
  if (!orgExists || !deptExists) {
    return res.status(400).json({
      success: false,
      message: "Organization or Department not found",
    });
  }
  try {
    const result = await Employee.findOneAndUpdate(
      { _id: employeeId },
      { firstName, lastName, position, imageUrl },
    );
    return res.status(200).json({
      success: true,
      message: "Employee information has been updated succesfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateContactInfo = async (req, res) => {
  const { email, phone, address, employeeId } = req.body;
  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: "Employee ID not provided",
    });
  }
  if (!email && !phone && !address) {
    return res.status(400).json({
      success: false,
      message: "Please provide contact information to update",
    });
  }
  try {
    const updatedFields = {};
    if (email) updatedFields["contactInfo.email"] = email;
    if (phone) updatedFields["contactInfo.phone"] = phone;
    if (address) updatedFields["constactInfo.address"] = address;
    const result = await Employee.findOneAndUpdate(
      { _id: employeeId },
      { $set: updatedFields },
      { new: true },
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Employee contact info has been updated succesfully",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server" });
  }
};

exports.updateAttendance = async (req, res) => {
  const { date, status, employeeId } = req.body;
  if (!employeeId) {
    return res
      .status(400)
      .json({ success: false, message: "Employee ID is not provided!" });
  }
  if (!date || !status) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide date and status." });
  }
  if (!validStatus.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "status is invalid" });
  }
  try {
    const result = await Employee.findOneAndUpdate(
      { _id: employeeId },
      { $push: { attendance: { date, status } } },
      { new: true },
    );

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Employee not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Attendance has been added succesfully",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updatePay = async (req, res) => {
  let { employeeId, orgId, baseSalary, datePaid, bonuses, deductions, method } =
    req.body;
  if (!employeeId || !orgId) {
    return res.status(400).json({
      success: false,
      message: "Pleasse provide employee id and organization id",
    });
  }
  if (!datePaid) {
    datePaid = Date.now();
  }
  if (!baseSalary) {
    return res.status(400).json({
      success: false,
      message: "Please provide base salary amount",
    });
  }
  if (!method) {
    return res.status(400).json({
      success: false,
      message: "Pleasse provide the payment method",
    });
  }

  const finalAmount = baseSalary + (bonuses || 0) - (deductions || 0);
  const newPayroll = new Payroll({
    employeeId,
    organizationId: orgId,
    datePaid,
    baseSalary,
    bonuses: bonuses || 0,
    deductions: deductions || 0,
    finalAmount: finalAmount,
    method: method,
  });

  try {
    const payrollResult = await newPayroll.save();
    if (!payrollResult) {
      return res
        .status(400)
        .json({ success: false, message: "Payroll creation failed" });
    }

    const employeeUpdate = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $push: { payrollIds: payrollResult._id },
      },
      { new: true },
    );

    if (!employeeUpdate) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Payroll created and linked to employee successfully",
      payroll: payrollResult,
      employee: employeeUpdate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEmployeesByOrg = async (req, res) => {
  const { orgId } = req.body;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization ID is required" });
  }
  try {
    const result = Employee.find({ organizationId: orgId });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "No employees found" });
    }
    return res.status(200).json({
      success: true,
      message: "Employees in the organization fetched succesfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEmployeesByDept = async (req, res) => {
  const { orgId, deptId } = req.query;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization ID is required" });
  }
  try {
    const result = Employee.find({
      organizationId: orgId,
      departmentId: deptId,
    });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "No employees found" });
    }
    return res.status(200).json({
      success: true,
      message: "Employees in the department fetched succesfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
