const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee ID is required"],
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department ID is required"],
    },

    date: {
      type: Date,
      ref: "Date",
      required: [true, "Date is required"],
    },

    status: {
      type: String,
      enum: ["present", "absent", "leave", "half-day", "wfh"],
      required: true,
    },
  },
  { timestamps: true },
);

AttendanceSchema.index(
  {
    employeeId: 1,
    date: 1,
  },
  { unique: true },
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
