const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },

  lastName: {
    type: String,
    trim: true,
    required: false,
  },

  type: {
    type: String,
    enum: ["Vendor", "Buyer", "other"],
    required: [true, "Contact type is required"],
  },

  contactInfo: {
    email: String,
    phone: String,
    Address: String,
  },

  notes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
