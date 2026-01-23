const mongoose = require("mongoose");

const positionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Position label must be unique"],
      trim: true,
    },

    OrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: false,
    },

    level: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Position", positionSchema);
