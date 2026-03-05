import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "../store/employeeStore";
import { useParams } from "react-router-dom";
import AttendanceCalendar from "../components/AttendanceCalendar";
import EmployeePayrolls from "../components/EmployeePayrolls";

const EmployeePage = () => {
  const navigate = useNavigate();
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
      await updateEmployeeAttendance({ employeeId, date, status });
      await getEmployeeAttendance(employeeId);
    } catch (err) {
      console.log("Error updating attendance", err);
    }
  };

  const displayName =
    [employeeData?.firstName, employeeData?.lastName].filter(Boolean).join(" ") || "Employee";
  const initial = (employeeData?.firstName?.[0] || employeeData?.lastName?.[0] || "E").toUpperCase();
  const role = employeeData?.position?.name;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-3xl font-semibold text-indigo-600">{initial}</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-900">{displayName}</h1>
                {role && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                    {role}
                  </span>
                )}
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {(employeeData?.contactInfo?.phone || employeeData?.contactInfo?.email) && (
                    <>
                      {employeeData?.contactInfo?.phone && (
                        <div>
                          <dt className="text-slate-500">Phone</dt>
                          <dd className="font-medium text-slate-900">{employeeData.contactInfo.phone}</dd>
                        </div>
                      )}
                      {employeeData?.contactInfo?.email && (
                        <div>
                          <dt className="text-slate-500">Email</dt>
                          <dd className="font-medium text-slate-900 truncate">{employeeData.contactInfo.email}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
                {!employeeData?.contactInfo?.phone && !employeeData?.contactInfo?.email && (
                  <p className="text-sm text-slate-500 mt-2">No contact info</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance - half page */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Attendance</h2>
              <AttendanceCalendar
                attendance={employeeAttendance ?? []}
                onDayUpdate={handleAttendanceUpdate}
              />
            </div>
          </div>

          {/* Payroll - half page */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Payroll history</h2>
              <EmployeePayrolls
                employeeId={employeeId}
                onPayrollAdded={() => getEmployee(employeeId)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
