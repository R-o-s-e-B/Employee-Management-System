const mongoose = require("mongoose");

const SalesReceiptSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dateReceived: {
      type: Date,
      default: Date.now,
    },

    // Buyer
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "upi", "cheque"],
      required: true,
    },

    // What was sold
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: Number,
        unit: {
          type: String,
          default: "kg",
        },
        rate: Number,
        amount: Number,
      },
    ],

    season: {
      type: String, // "2025 Harvest"
    },

    batchId: {
      type: String, // optional traceability
    },

    notes: {
      type: String,
    },

    receiptUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "finalized"],
      default: "finalized",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SalesReceipt", SalesReceiptSchema);
