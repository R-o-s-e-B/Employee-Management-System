const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/all-employees", employeeController.getEmployeesByOrg);
router.get("/employees-by-dept", employeeController.getEmployeesByDept);
router.post("/newEmployee", employeeController.createEmployee);
router.patch("/updateEmployee", employeeController.updateEmployee);
router.patch("/updateAttendance", employeeController.updateAttendance);
router.patch("/updatePay", employeeController.updatePay);
router.patch("/updateContactInfo", employeeController.updateContactInfo);

module.exports = router;
