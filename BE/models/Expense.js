const { required, date } = require("joi");
const mongoose = require("mongoose");

const ExpenseSchema = mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Account id is required"],
  },

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: false,
  },

  zone: {
    type: String,
    required: false,
  },

  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: {
        type: Number,
      },
      rate: {
        type: Number,
      },
      amount: {
        type: Number,
      },
    },
  ],

  paymentMethod: {
    type: String,
    enum: ["cash", "bank", "upi", "cheque"],
  },

  notes: {
    type: String,
    required: false,
  },

  billUrl: {
    type: String,
    trim: true,
    required: false,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
