const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/all-employees", employeeController.getEmployeesByOrg);
router.get("/employees-by-dept", employeeController.getEmployeesByDept);
router.get("/:employeeId", employeeController.getEmployeeDetails);
router.post("/newEmployee", employeeController.createEmployee);
router.delete("/deleteEmployee/:employeeId", employeeController.deleteEmployee);
router.patch("/updateEmployee", employeeController.updateEmployee);
router.patch("/updatePay", employeeController.updatePay);
router.patch("/updateContactInfo", employeeController.updateContactInfo);
router.get(
  "/attendance/:employeeId",
  employeeController.getAttendanceByEmployeeId,
);
router.patch("/attendance", employeeController.createAttendanceRecord);

module.exports = router;
