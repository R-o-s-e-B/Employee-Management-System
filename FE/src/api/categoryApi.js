import axiosInstance from "../utils/axiosInstance";

export const createCategoriesApi = async (params) => {
  const { data } = await axiosInstance.post("category/", params);
  return data;
};

export const getCategoriesApi = async ({ orgId }) => {
  const { data } = await axiosInstance.get(`category/${orgId}`);
  return data;
};

export const updateCategoryApi = async ({ orgId, categoryId, params }) => {
  const { data } = await axiosInstance.put(
    `category/${orgId}/${categoryId}`,
    params,
  );
  return data;
};

export const deleteCategoryApi = async ({ orgId, categoryId }) => {
  await axiosInstance.delete(`category/${orgId}/${categoryId}`);
};
