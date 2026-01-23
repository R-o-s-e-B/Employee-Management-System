import React, { useEffect, useState } from "react";
import { useDeptStore } from "../store/deptStore";
import { useParams } from "react-router-dom";
import { useOrgStore } from "../store/orgStore";
import EmployeeForm from "../components/forms/EmployeeForm";

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

  return (
    <React.Fragment>
      <h1>Department dashboard</h1>
      <h2>{deptData.department.name}</h2>

      <h3>Employee Table</h3>
      <button onClick={() => setEmployeeModal(!employeeModal)}>
        {" "}
        Create new employee{" "}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <EmployeeForm orgId={orgId} deptId={deptId} />
      </div>
    </React.Fragment>
  );
};

export default DepartmentDashboard;
