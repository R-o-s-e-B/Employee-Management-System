import React, { useEffect } from "react";
import { useEmployeeStore } from "../store/employeeStore";
import { useParams } from "react-router-dom";
import AttendanceCalendar from "../components/AttendanceCalendar";
import EmployeePayrolls from "../components/EmployeePayrolls";

const EmployeePage = () => {
  const {
    getEmployee,
    employeeData,
    getEmployeeAttendance,
    updateEmployeeAttendance,
    employeeAttendance,
  } = useEmployeeStore();
  const { employeeId } = useParams();

  useEffect(() => {
    const getEmployeeDetails = async (id) => {
      try {
        await getEmployee(id);
      } catch (err) {
        console.log("Error fetching employee details: ", err);
      }
    };
    getEmployeeDetails(employeeId);
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;

    getEmployeeAttendance(employeeId);
  }, [employeeId]);

  const handleAttendanceUpdate = async (date, status) => {
    try {
      await updateEmployeeAttendance({
        employeeId,
        date,
        status,
      });

      await getEmployeeAttendance(employeeId);
    } catch (err) {
      console.log("Error updating attendance", err);
    }
  };

  return (
    <React.Fragment>
      <h2>Employee page</h2>
      <p>Name: {employeeData.firstName + " " + employeeData.lastName} </p>
      <p>Contact: {employeeData?.contactInfo.phone}</p>
      <p>Position: {employeeData.position?.name}</p>
      <AttendanceCalendar
        attendance={employeeAttendance}
        onDayUpdate={handleAttendanceUpdate}
      />
      <EmployeePayrolls
        employeeId={employeeId}
        payrolls={employeeData?.payrollIds}
      />
    </React.Fragment>
  );
};

export default EmployeePage;
