import React, { useState, useEffect, useCallback } from "react";
import PayrollForm from "./forms/PayrollForm";
import { getPayrollsByEmployeeApi } from "../api/employeeApi";

const PAYMENT_METHODS = [
  { value: "", label: "All methods" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
];

const EmployeePayrolls = ({ employeeId, onPayrollAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    method: "",
    fromDate: "",
    toDate: "",
  });

  const fetchPayrolls = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const params = {};
      if (filters.method) params.method = filters.method;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      const { result } = await getPayrollsByEmployeeApi(employeeId, params);
      setPayrolls(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, filters.method, filters.fromDate, filters.toDate]);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleSuccess = () => {
    setShowModal(false);
    onPayrollAdded?.();
    fetchPayrolls();
  };

  const hasActiveFilters = filters.method || filters.fromDate || filters.toDate;
  const handleClearFilters = () => setFilters({ method: "", fromDate: "", toDate: "" });

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add payroll
      </button>

      {(payrolls.length > 0 || hasActiveFilters) && (
        <div className="mb-4 p-3 rounded-xl border border-slate-200 bg-white">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Filters</p>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[120px]">
              <label className="block text-xs text-slate-500 mb-0.5">Method</label>
              <select
                value={filters.method}
                onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
                className="block w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value || "all"} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-0.5">From date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                className="block rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-0.5">To date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                className="block rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md my-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Add payroll</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <PayrollForm employeeId={employeeId} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading payrolls...</p>
      ) : payrolls.length > 0 ? (
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
                    <dd className="text-slate-700 capitalize">{String(payroll.method).replace("_", " ")}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>
      ) : hasActiveFilters ? (
        <p className="text-sm text-slate-500">No payroll records match the filters.</p>
      ) : (
        <p className="text-sm text-slate-500">No payroll records yet.</p>
      )}
    </>
  );
};

export default EmployeePayrolls;
