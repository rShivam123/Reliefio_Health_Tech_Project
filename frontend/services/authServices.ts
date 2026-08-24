import api from "../lib/axios";
import { LoginData, SignupData, OTPData } from "@/types/auth";
import { ApiResponse, CurrentUser } from "@/types/common";

export const signupUser = async (data: SignupData) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data: LoginData) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const verifyOTP = async (data: OTPData) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (data: { email: string; otp: string; newPassword: string }) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: CurrentUser }>> => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const res = await api.put("/auth/change-password", data);
  return res.data;
};
