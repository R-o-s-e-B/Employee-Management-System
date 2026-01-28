const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

exports.getAttendanceByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: "Employee Id not found.",
    });
  }
  try {
    const result = Attendance.find({ employeeId: employeeId }).sort({
      date: 1,
    });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Attendance details for the employee ID was not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Attendance details fetched successfully",
      result,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.createAttendanceRecord = async (req, res) => {
  const { employeeId, date, status } = req.body;
  if (!employeeId) {
    return res
      .status(400)
      .json({ success: false, message: "EmployeeId is required" });
  }
  if (!date) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide date" });
  }
  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide attendance status." });
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res
      .status(404)
      .json({ success: false, message: "Employee with provided id not found" });
  }

  try {
    const organizationId = employee.organizationId;
    const departmentId = employee.departmentId;

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId: employeeId, date: attendanceDate },
      {
        employeeId,
        date: attendanceDate,
        status,
        organizationId,
        departmentId,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Attendance has been updated successfully",
      attendance,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Attendance already exists for this date",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};
