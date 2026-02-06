const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Account name is required"],
  },

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Organization Id is required"],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
});

module.exports = mongoose.model("Account", AccountSchema);
