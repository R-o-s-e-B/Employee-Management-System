import { data } from "autoprefixer";
import axiosInstance from "../utils/axiosInstance";

export const loginApi = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/signin", credentials);
  console.log("logging in with data", data);
  return data;
};

export const signupApi = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/signup", credentials);
  return data;
};

export const logoutApi = async () => {
  await axiosInstance.post("/auth/logout");
};
