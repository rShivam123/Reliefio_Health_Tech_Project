import Notification from "../models/notification.js";
import { Types } from "mongoose";

export const notify = async (
  userId: Types.ObjectId | string,
  title: string,
  message: string,
  type = "general",
  link = ""
) => {
  try {
    await Notification.create({ user: userId, title, message, type, link });
  } catch (error) {
    // Notifications are best-effort - never break the primary action.
    console.error("Failed to create notification:", error);
  }
};
