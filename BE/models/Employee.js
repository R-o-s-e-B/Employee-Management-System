const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required"],
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization Id is required"],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department Id is required"],
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: false,
    },
    salary: {
      type: Number,
      required: false,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },

    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },

    attendance: [
      {
        date: { type: Date, required: true },
        status: {
          type: String,
          enum: ["present", "absent", "leave"],
          required: true,
        },
      },
    ],

    payrollIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payroll",
      },
    ],
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
