const { mongo, default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },

    color: {
      type: String, // optional UI enhancement
    },

    isSystem: {
      type: Boolean,
      default: false, // system vs user-created
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", CategorySchema);
