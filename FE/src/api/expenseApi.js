import axiosInstance from "../utils/axiosInstance";

export const createExpenseApi = async (params) => {
  const { data } = await axiosInstance.post("expense/", params);
  return data;
};

export const getExpensesByOrgApi = async ({ orgId }) => {
  const { data } = await axiosInstance.get(`expense/${orgId}`);
  return data;
};

export const updateExpenseApi = async ({ orgId, expenseId, params }) => {
  const { data } = await axiosInstance.put(
    `expense/${orgId}/${expenseId}`,
    params,
  );
  return data;
};

export const deleteExpenseApi = async ({ orgId, expenseId }) => {
  await axiosInstance.delete(`expense/${orgId}/${expenseId}`);
};
