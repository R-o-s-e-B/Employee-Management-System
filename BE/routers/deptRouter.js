const express = require("express");
const router = express.Router();
const deptController = require("../controllers/deptController");

router.get("/allDepartments", deptController.getDeptsInOrg);
router.post("/createDept", deptController.createDepartment);
router.delete("/deleteDept", deptController.deleteDepartment);
router.patch("/editDept", deptController.editDepartment);

module.exports = router;
