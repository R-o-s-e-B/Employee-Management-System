import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeptStore } from "../store/deptStore";
import { useParams } from "react-router-dom";
import { useOrgStore } from "../store/orgStore";
import { usePositionStore } from "../store/positionStore";
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Department Dashboard
          </h1>
          <h2 className="text-xl text-gray-600">{deptData.department.name}</h2>
        </div>

        {/* Employee Modal */}
        {employeeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {employeeUpdate.editMode
                      ? "Edit Employee"
                      : "Create New Employee"}
                  </h3>
                  <button
                    onClick={() => {
                      setEmployeeModal(false);
                      setEmployeeUpdate({ editMode: false, employeeData: null });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Positions Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Positions
                </h3>
              </div>
              <div className="space-y-2">
                {positions && positions.length > 0 ? (
                  positions.map((position) => (
                    <div
                      key={position._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {position.name}
                      </span>
                      <button
                        onClick={() => onDeletePosition(position._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No positions found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employees Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Employees
                </h3>
                <button
                  onClick={() => {
                    setEmployeeModal(true);
                    setEmployeeUpdate({ editMode: false, employeeData: null });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Employee
                </button>
              </div>

              {allEmployees && allEmployees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allEmployees.map((employee) => (
                        <tr
                          key={employee._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              onClick={() =>
                                navigate(`/employee/${employee._id}`)
                              }
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              {employee.firstName + " " + employee.lastName}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {employee?.position?.name || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {employee?.contactInfo?.phone || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEmployeeModal(true);
                                  setEmployeeUpdate({
                                    editMode: true,
                                    employeeData: employee,
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee._id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No employees found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Create your first employee to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
