import React, { useEffect, useState } from "react";
import { useDeptStore } from "../store/deptStore";
import { useParams } from "react-router-dom";
import { useOrgStore } from "../store/orgStore";

const DepartmentDashboard = () => {
  const { deptId } = useParams();
  const { orgId } = useOrgStore();
  const { getDeptDetails, deptData } = useDeptStore();
  const [employeeModal, setEmployeeModal] = useState(false);
  useEffect(() => {
    async function getDept() {
      try {
        await getDeptDetails({ deptId: deptId });
      } catch (err) {
        throw err;
      }
    }
    getDept();
  }, [deptId]);

  console.log("dept details: ", deptData);

  return (
    <React.Fragment>
      <h1>Department dashboard</h1>
      <h2>{deptData.department.name}</h2>

      <h3>Employee Table</h3>
      <button onClick={() => setEmployeeModal(!employeeModal)}>
        {" "}
        Create new employee{" "}
      </button>

      <div>
        <input placeholder="first name"></input>
        <input placeholder="last name"></input>
        <input placeholder="position"></input>
        <input type="number" placeholder="salary"></input>
        <input type="email" placeholder="email"></input>
        <input placeholder="phone"></input>
        <input placeholder="address"></input>
      </div>
    </React.Fragment>
  );
};

export default DepartmentDashboard;
