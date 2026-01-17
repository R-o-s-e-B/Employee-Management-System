const mongoose = require("mongoose");

const OrganizationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Organization name is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", OrganizationSchema);
