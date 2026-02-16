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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-2xl font-bold text-blue-600">
                  {employeeData.firstName?.[0]?.toUpperCase() ||
                    employeeData.lastName?.[0]?.toUpperCase() ||
                    "E"}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                {employeeData.firstName + " " + employeeData.lastName}
              </h2>

              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Position
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {employeeData.position?.name || "N/A"}
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Contact
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {employeeData?.contactInfo?.phone || "N/A"}
                  </dd>
                </div>

                {employeeData?.contactInfo?.email && (
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employeeData.contactInfo.email}
                    </dd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Attendance Calendar
              </h3>
              <AttendanceCalendar
                attendance={employeeAttendance}
                onDayUpdate={handleAttendanceUpdate}
              />
            </div>

            {/* Payrolls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Payroll History
              </h3>
              <EmployeePayrolls
                employeeId={employeeId}
                payrolls={employeeData?.payrollIds}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
