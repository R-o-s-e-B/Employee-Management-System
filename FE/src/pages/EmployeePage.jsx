import React, { useEffect } from "react";
import { useEmployeeStore } from "../store/employeeStore";
import { useParams } from "react-router-dom";
import AttendanceCalendar from "../components/AttendanceCalendar";

const EmployeePage = () => {
  const { getEmployee, employeeData } = useEmployeeStore();
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

  console.log("Employee data from employee page is: ", employeeData);

  return (
    <React.Fragment>
      <h2>Employee page</h2>
      <p>Name: {employeeData.firstName + " " + employeeData.lastName} </p>
      <p>Contact: {employeeData?.contactInfo.phone}</p>
      <p>Position: {employeeData.position?.name}</p>
      <AttendanceCalendar />
    </React.Fragment>
  );
};

export default EmployeePage;
