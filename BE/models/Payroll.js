const mongoose = require("mongoose");

const payrollSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    datePaid: { type: Date, required: true },
    baseSalary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["bank_transfer", "cash", "check"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);
