const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Item name is required."],
  },

  OrganizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  unit: {
    type: String,
    enum: ["kg", "litre", "bag"],
  },
});

module.exports = mongoose.model("Item", itemSchema);
