import axiosInstance from "../utils/axiosInstance";

export const createExpenseApi = async (params) => {
  const { data } = await axiosInstance.post("expense/", params);
  return data;
};

export const getExpensesByOrgApi = async ({ orgId, accountId, category, fromDate, toDate }) => {
  const params = {};
  if (accountId) params.accountId = accountId;
  if (category) params.category = category;
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  const { data } = await axiosInstance.get(`expense/${orgId}`, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
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
