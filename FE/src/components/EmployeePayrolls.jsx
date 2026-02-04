import React from "react";
import PayrollForm from "./forms/PayrollForm";
import { useState } from "react";

const EmployeePayrolls = ({ employeeId, payrolls }) => {
  const [showForm, setShowForm] = useState(false);
  console.log("Payroll ids: ", payrolls);
  return (
    <React.Fragment>
      <h2>Payrolls</h2>
      <button onClick={() => setShowForm(!showForm)}>Add payroll</button>
      {showForm ? <PayrollForm employeeId={employeeId} /> : null}

      {payrolls?.map((payroll) => (
        <div style={{ color: "white" }}>
          <p>{payroll._id}</p>
          <p>Paid on</p>
          <p>{payroll.datePaid}</p>
          <p>Total amount</p>
          <p>{payroll.finalAmount}</p>
          <p>bonuses</p>
          <p>{payroll.bonuses}</p>
          <p>Deductions</p>
          <p>{payroll.deductions}</p>
          <p>Payment method</p>
          <p>{payroll.method}</p>
        </div>
      ))}
    </React.Fragment>
  );
};

export default EmployeePayrolls;
