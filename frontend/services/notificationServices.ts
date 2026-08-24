import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number }>> => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put("/notifications/read-all");
  return res.data;
};
