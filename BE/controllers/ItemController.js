const Item = require("../models/item.js");

exports.getItems = async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "organization Id is required" });
  }

  try {
    const result = await Item.find({ organizationId: orgId });
    if (result.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "No items found for the organization",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Items fetched successfully", result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.createItems = async (req, res) => {
  const { orgId, items } = req.body;

  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization Id is required" });
  }

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items array cannot be empty",
    });
  }

  try {
    const data = items
      .filter((c) => c?.name?.trim())
      .map((c) => ({
        organizationId: orgId,
        name: c.name.trim(),
        unit: c.unit,
      }));

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid items provided",
      });
    }

    const existing = await Item.find({
      organizationId: orgId,
      name: { $in: data.map((d) => d.name) },
    });

    const existinNames = new Set(existing.map((c) => c.name));
    const newData = data.filter((d) => !existinNames.has(d.name));

    if (newData.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All Items already exist",
      });
    }

    const result = await Item.insertMany(newData, {
      ordered: false,
    });

    return res.status(201).json({
      success: true,
      message: "Items created successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating items",
      err,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { orgId, name, unit } = req.body;

    if (!orgId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Item ID are required",
      });
    }

    const item = await Item.findOne({
      _id: itemId,
      organizationId: orgId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check duplicate name
    if (name) {
      const duplicate = await Item.findOne({
        organizationId: orgId,
        name: name.trim(),
        _id: { $ne: itemId },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Item with this name already exists",
        });
      }

      item.name = name.trim();
    }

    if (unit) item.unit = unit;

    const result = await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating item",
      error: err.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { orgId } = req.body;

    if (!orgId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Item ID are required",
      });
    }

    const item = await Item.findOne({
      _id: itemId,
      organizationId: orgId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await Item.findByIdAndDelete(itemId);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting item",
      error: err.message,
    });
  }
};
