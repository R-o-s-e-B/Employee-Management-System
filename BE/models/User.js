const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    OrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: function () {
        return this.role !== "admin";
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email must be unique"],
      minLength: [5, "Email must contain atleast 5 characters"],
      lowercase: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      select: false,
    },

    role: {
      type: String,
      required: [true, "Role not provided"],
      trim: true,
    },

    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departments",
        required: false,
      },
    ],

    verified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      select: false,
    },

    verificationCodeValidation: {
      type: Number,
      select: false,
    },

    forgotPasswordCode: {
      type: String,
      select: false,
    },

    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
