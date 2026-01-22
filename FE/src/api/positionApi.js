import axiosInstance from "../utils/axiosInstance";

export const getPositionsApi = async (orgId) => {
  const { result } = await axiosInstance.get("position/", {
    params: {
      orgId: orgId,
    },
  });
  return result;
};

export const createPositionApi = async (params) => {
  const { result } = await axiosInstance.post("position/", params);
  return result;
};

export const deletePositionApi = async (id) => {
  await axiosInstance.delete(`position/${id}`);
};
