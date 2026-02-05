const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Account name is required"],
  },
});

module.exports = mongoose.model("Account", AccountSchema);
