import axiosInstance from "../utils/axiosInstance";

export const getDeptsApi = async (orgId) => {
  const { data } = await axiosInstance.get("dept/allDepartments", {
    params: { orgId },
  });
  return data;
};

export const deleteDeptApi = async ({ deptId }) => {
  await axiosInstance.delete(`dept/deleteDept/${deptId}`);
};

export const createDeptApi = async (params) => {
  const { data } = await axiosInstance.post("dept/createDept", params);
  return data;
};

export const editDeptApi = async (params) => {
  const { data } = await axiosInstance.patch("dept/editDept", params);
  return data;
};

export const getDeptDetailsApi = async ({ deptId }) => {
  const { data } = await axiosInstance.get(`dept/deptDetails/${deptId}`);
  console.log("data from api caller: ", data);
  return data;
};
