import React, { useEffect, useState } from "react";
import { useDeptStore } from "../store/deptStore";
import { useParams } from "react-router-dom";
import { useOrgStore } from "../store/orgStore";
import { usePositionStore } from "../store/positionStore";
import { useEmployeeStore } from "../store/employeeStore";
import EmployeeForm from "../components/forms/EmployeeForm";

const DepartmentDashboard = () => {
  const { deptId } = useParams();
  const { orgId } = useOrgStore();
  const { getDeptDetails, deptData } = useDeptStore();
  const [employeeModal, setEmployeeModal] = useState(false);
  const { allEmployees, getEmployees, deleteEmployee } = useEmployeeStore();
  const { positions, deletePosition, getPositions } = usePositionStore();
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

  useEffect(() => {
    async function getAllEmployees() {
      try {
        await getEmployees({ orgId, deptId });
      } catch (err) {
        console.log("fetching employees failed: ", err);
      }
    }
    getAllEmployees();
  }, [deptId, orgId]);

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
    } catch (err) {
      console.log(err);
    }
  };

  const onDeletePosition = async (id) => {
    try {
      await deletePosition({ id });
    } catch (err) {
      console.log("delete position failed: ", err);
    }
  };

  return (
    <React.Fragment>
      <h1>Department dashboard</h1>
      <h2>{deptData.department.name}</h2>

      <h3>Employee Table</h3>
      <button onClick={() => setEmployeeModal(!employeeModal)}>
        {" "}
        Create new employee{" "}
      </button>
      {employeeModal ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <EmployeeForm deptId={deptId} setShowForm={setEmployeeModal} />
        </div>
      ) : (
        <></>
      )}

      <div style={{ flex: "1" }}>
        {positions.map((position) => (
          <div key={position._id}>
            <p>{position.name}</p>
            <button onClick={() => onDeletePosition(position._id)}>
              delete position
            </button>
          </div>
        ))}

        <div style={{ flex: 1 }}>
          {allEmployees?.map((employee) => (
            <div
              style={{ flex: 1, flexDirection: "column" }}
              key={employee._id}
            >
              <a>{employee.firstName + " " + employee.lastName}</a>
              <p>{employee?.position?.name}</p>
              <p>{employee?.contactInfo?.phone}</p>
              <button onClick={() => handleDeleteEmployee(employee._id)}>
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DepartmentDashboard;
