import axiosInstance from "../utils/axiosInstance";

export const getPositionsApi = async (orgId) => {
  const { data } = await axiosInstance.get("position/", {
    params: {
      orgId: orgId,
    },
  });
  return data;
};

export const createPositionApi = async (params) => {
  const { data } = await axiosInstance.post("position/", params);
  return data;
};

export const deletePositionApi = async (id) => {
  await axiosInstance.delete(`position/${id}`);
};
