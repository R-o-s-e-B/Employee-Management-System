import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeptStore } from "../store/deptStore";
import { useParams } from "react-router-dom";
import { useOrgStore } from "../store/orgStore";
import { useEmployeeStore } from "../store/employeeStore";
import EmployeeForm from "../components/forms/EmployeeForm";

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const { deptId } = useParams();
  const { orgId } = useOrgStore();
  const { getDeptDetails, deptData } = useDeptStore();
  const [employeeModal, setEmployeeModal] = useState(false);
  const [employeeUpdate, setEmployeeUpdate] = useState({
    editMode: false,
    employeeData: null,
  });
  const { allEmployees, getEmployees, deleteEmployee } = useEmployeeStore();
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

  const deptName = deptData?.department?.name ?? "Department";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-semibold text-slate-900">{deptName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage employees</p>
        </header>

        {employeeModal && (
          <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {employeeUpdate.editMode ? "Edit employee" : "Create employee"}
                  </h3>
                  <button
                    onClick={() => {
                      setEmployeeModal(false);
                      setEmployeeUpdate({ editMode: false, employeeData: null });
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <EmployeeForm
                  deptId={deptId}
                  setShowForm={setEmployeeModal}
                  editMode={employeeUpdate.editMode}
                  employeeData={employeeUpdate.employeeData}
                />
              </div>
            </div>
          </div>
        )}

        <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-slate-800">Employees</h3>
                <button
                  onClick={() => {
                    setEmployeeModal(true);
                    setEmployeeUpdate({ editMode: false, employeeData: null });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create employee
                </button>
              </div>

              {allEmployees && allEmployees.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {allEmployees.map((employee) => (
                        <tr key={employee._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => navigate(`/employee/${employee._id}`)}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 text-left"
                            >
                              {employee.firstName + " " + employee.lastName}
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{employee?.position?.name || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{employee?.contactInfo?.phone || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEmployeeModal(true);
                                  setEmployeeUpdate({ editMode: true, employeeData: employee });
                                }}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee._id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg border border-slate-200 bg-slate-50/50">
                  <p className="text-slate-600 font-medium">No employees yet</p>
                  <p className="text-slate-400 text-sm mt-1">Create your first employee to get started</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
