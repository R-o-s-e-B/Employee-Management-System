import axiosInstance from "../utils/axiosInstance";

export const getDepts = async (orgId) => {
  const { data } = await axiosInstance.get("dept/allDepartments", {
    params: { orgId },
  });
  return data;
};

export const deleteDept = async (params) => {
  await axiosInstance.delete("dept/deleteDept", params);
};

export const createDept = async (params) => {
  const { data } = await axiosInstance.post("dept/createDept", params);
  return data;
};

export const editDept = async (params) => {
  const { data } = await axiosInstance.post("dept/editDept", params);
  return data;
};
