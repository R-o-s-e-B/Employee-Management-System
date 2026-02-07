const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

router.post("/", categoryController.createCategories);
router.get("/:orgId", categoryController.getCategories);
router.put("/:orgId/:categoryId", categoryController.updateCategory);
router.delete("/:orgId/:categoryId", categoryController.deleteCategory);

module.exports = router;
