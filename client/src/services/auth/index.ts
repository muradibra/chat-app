import axiosInstance from "../axiosInstance";
import { TCheckAuth } from "./types";

const checkAuth = async () => {
  const resp = await axiosInstance.get<TCheckAuth>("/auth/check");
  return resp.data;
};

const signUp = async (data: {
  fullname: string;
  email: string;
  password: string;
}) => {
  const resp = await axiosInstance.post("/auth/signup", data);
  return resp.data;
};

const logOut = async () => {
  const resp = await axiosInstance.post("/auth/logout");
  return resp.data;
};

const login = async (data: { email: string; password: string }) => {
  const resp = await axiosInstance.post("/auth/login", data);
  return resp.data;
};

const updateProfileInfo = async (data: { profilePic: string }) => {
  const resp = await axiosInstance.put("/auth/update-profile", data);
  return resp.data;
};

const authService = {
  checkAuth,
  signUp,
  logOut,
  login,
  updateProfileInfo,
};

export default authService;
