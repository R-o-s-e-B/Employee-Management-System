import React, { useState } from "react";
import PayrollForm from "./forms/PayrollForm";

const EmployeePayrolls = ({ employeeId, payrolls }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
      >
        {showForm ? "Cancel" : "Add payroll"}
      </button>
      {showForm && (
        <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <PayrollForm employeeId={employeeId} />
        </div>
      )}

      {payrolls?.length > 0 ? (
        <ul className="space-y-3">
          {payrolls.map((payroll) => (
            <li
              key={payroll._id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/50"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium text-slate-900">
                  ₹{payroll.finalAmount != null ? Number(payroll.finalAmount).toLocaleString() : "—"}
                </span>
                <span className="text-xs text-slate-500">
                  {payroll.datePaid ? new Date(payroll.datePaid).toLocaleDateString() : "—"}
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {payroll.bonuses != null && (
                  <div>
                    <dt className="text-slate-500">Bonuses</dt>
                    <dd className="text-slate-700">₹{Number(payroll.bonuses).toLocaleString()}</dd>
                  </div>
                )}
                {payroll.deductions != null && (
                  <div>
                    <dt className="text-slate-500">Deductions</dt>
                    <dd className="text-slate-700">₹{Number(payroll.deductions).toLocaleString()}</dd>
                  </div>
                )}
                {payroll.method && (
                  <div>
                    <dt className="text-slate-500">Method</dt>
                    <dd className="text-slate-700 capitalize">{payroll.method}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No payroll records yet.</p>
      )}
    </>
  );
};

export default EmployeePayrolls;
