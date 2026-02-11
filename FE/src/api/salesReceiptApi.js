import axiosInstance from "../utils/axiosInstance";

export const createSalesReceiptApi = async (params) => {
  const { data } = await axiosInstance.post("salesReceipt/", params);
  return data;
};

export const getSalesReceiptsByOrgApi = async ({ orgId, queryParams }) => {
  const { data } = await axiosInstance.get(`salesReceipt/${orgId}`, {
    params: queryParams,
  });
  return data;
};

export const updateSalesReceiptApi = async ({ receiptId, params }) => {
  const { data } = await axiosInstance.put(
    `salesReceipt/${receiptId}`,
    params,
  );
  return data;
};

export const deleteSalesReceiptApi = async ({ receiptId }) => {
  await axiosInstance.delete(`salesReceipt/${receiptId}`);
};
