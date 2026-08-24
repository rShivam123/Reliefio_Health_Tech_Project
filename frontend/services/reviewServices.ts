import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Review } from "@/types/doctor";

export const getReviewsForDoctor = async (doctorId: string): Promise<ApiResponse<Review[]>> => {
  const res = await api.get("/reviews", { params: { doctorId } });
  return res.data;
};

export const createReview = async (payload: { appointmentId: string; rating: number; comment?: string }) => {
  const res = await api.post("/reviews", payload);
  return res.data;
};

export const getMyReviews = async (): Promise<ApiResponse<Review[]>> => {
  const res = await api.get("/reviews/mine");
  return res.data;
};
