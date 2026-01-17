import axiosInstance from "../utils/axiosInstance";

export const getOrgs = async (params) => {
  const { data } = await axiosInstance.get("org/allOrgs", params);
  return data;
};

export const deleteOrg = async (params) => {
  await axiosInstance.delete("org/deleteOrg", { data: params });
};

export const createOrg = async (params) => {
  const { data } = await axiosInstance.post("org/newOrg", params);
  return data;
};

export const getUserOrg = async (params) => {
  const { data } = await axiosInstance.get("org/userOrgs", params);
  return data;
};
