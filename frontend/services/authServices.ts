import api from "../lib/axios";

export const signupUser = async (data: any) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const verifyOTP = async (data: any) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", {
    email,
  });

  return res.data;
};