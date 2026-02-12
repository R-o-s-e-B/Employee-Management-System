import axiosInstance from "../utils/axiosInstance";

export const createAccountApi = async (params) => {
  const { data } = await axiosInstance.post("account/", params);
  return data;
};

export const getAccountsApi = async ({ orgId }) => {
  const { data } = await axiosInstance.get(`account/${orgId}`);
  return data;
};
