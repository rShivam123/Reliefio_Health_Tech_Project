import { Response } from "express";
import Notification from "../models/notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";

// GET /api/notifications
export const listNotifications = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: req.user!._id }).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ user: req.user!._id, isRead: false }),
  ]);

  res.json(ok("Notifications fetched", { notifications, unreadCount }));
});

// PUT /api/notifications/:id/read
export const markNotificationRead = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user!._id });
  if (!notification) throw new AppError("Notification not found", 404);

  notification.isRead = true;
  await notification.save();

  res.json(ok("Notification marked as read", notification));
});

// PUT /api/notifications/read-all
export const markAllNotificationsRead = asyncHandler(async (req: AuthedRequest, res: Response) => {
  await Notification.updateMany({ user: req.user!._id, isRead: false }, { isRead: true });
  res.json(ok("All notifications marked as read"));
});
