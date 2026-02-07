const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization id is required" });
  }

  try {
    const result = await Category.find({ organizationId: orgId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No Category found for the organization",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      result,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", err });
  }
};

exports.createCategories = async (req, res) => {
  const { organizationId, type, categories } = req.body;

  if (!organizationId || !type || !Array.isArray(categories)) {
    return res.status(400).json({
      success: false,
      message: "organizationId, type and categories array are required",
    });
  }

  if (!["expense", "income"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category type",
    });
  }

  if (categories.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Categories array cannot be empty",
    });
  }

  try {
    const docs = categories
      .filter((c) => c?.name?.trim())
      .map((c) => ({
        organizationId,
        name: c.name.trim(),
        type,
        color: c.color,
        isSystem: false,
      }));

    if (docs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid categories provided",
      });
    }

    const existing = await Category.find({
      organizationId,
      type,
      name: { $in: docs.map((d) => d.name) },
    });

    const existingNames = new Set(existing.map((c) => c.name));

    const newDocs = docs.filter((d) => !existingNames.has(d.name));

    if (newDocs.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All categories already exist",
      });
    }

    const result = await Category.insertMany(newDocs, {
      ordered: false,
    });

    return res.status(201).json({
      success: true,
      message: "Categories created successfully",
      result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating categories",
      err,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { orgId, categoryId } = req.params;
    const { name, color } = req.body;

    if (!orgId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Category ID are required",
      });
    }

    const category = await Category.findOne({
      _id: categoryId,
      organizationId: orgId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.isSystem) {
      return res.status(403).json({
        success: false,
        message: "System categories cannot be modified",
      });
    }

    // Check duplicate name
    if (name) {
      const duplicate = await Category.findOne({
        organizationId: orgId,
        type: category.type,
        name: name.trim(),
        _id: { $ne: categoryId },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      category.name = name.trim();
    }

    if (color !== undefined) {
      category.color = color;
    }

    const result = await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating category",
      error: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { orgId, categoryId } = req.params;

    if (!orgId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Category ID are required",
      });
    }

    const category = await Category.findOne({
      _id: categoryId,
      organizationId: orgId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.isSystem) {
      return res.status(403).json({
        success: false,
        message: "System categories cannot be deleted",
      });
    }

    category.isActive = false;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: err.message,
    });
  }
};
