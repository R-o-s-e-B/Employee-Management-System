import axiosInstance from "../utils/axiosInstance";

export const createItemsApi = async (params) => {
  const { data } = await axiosInstance.post("item/", params);
  return data;
};

export const getItemsApi = async (orgId) => {
  const { data } = await axiosInstance.get(`item/${orgId}`);
  return data;
};

export const updateItemApi = async ({ itemId, params }) => {
  const { data } = await axiosInstance.put(`item/${itemId}`, params);
  return data;
};

export const deleteItemApi = async ({ itemId, orgId }) => {
  await axiosInstance.delete(`item/${itemId}`, { data: { orgId } });
};
