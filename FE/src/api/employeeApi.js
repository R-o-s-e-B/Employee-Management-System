import axiosInstance from "../utils/axiosInstance";

export const getEmployeesApi = async (deptId, orgId) => {
  const { data } = await axiosInstance.get("employee/employees-by-dept", {
    params: { deptId, orgId },
  });
  return data;
};

export const createEmployeeApi = async (body) => {
  const { data } = await axiosInstance.post("employee/newEmployee", body);
  return data;
};

export const deleteEmployeeApi = async (employeeId) => {
  const { data } = await axiosInstance.delete(
    `employee/deleteEmployee/${employeeId}`,
  );
  return data;
};

export const updateEmployeeApi = async (body) => {
  const { data } = await axiosInstance.put("employee/updateEmployee", body);
  return data;
};

export const updateEmployeeContactDetailsApi = async (body) => {
  const { data } = await axiosInstance.put("employee/updateContactInfo", body);
  return data;
};

export const updateEmployeeAttendanceApi = async (body) => {
  const { data } = await axiosInstance.put("employee/updateAttendance", body);
  return data;
};

export const updateEmployeePayApi = async (body) => {
  const { data } = await axiosInstance.put("employee/updatePay", body);
  return data;
};
