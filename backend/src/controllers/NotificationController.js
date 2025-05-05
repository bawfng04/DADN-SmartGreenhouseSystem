const notificationService = require("../services/NotificationService");

class NotificationController {
  // GET /api/notifications
  async getUserNotifications(req, res) {
    const userId = req.user?.id; // lấy user id từ token

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User ID not found" });
    }

    try {
      const notifications = await notificationService.getNotificationsForUser(
        userId
      );
      res.status(200).json(notifications);
    } catch (error) {
      console.error(
        "Error in NotificationController.getUserNotifications:",
        error
      );
      res
        .status(500)
        .json({ error: error.message || "Failed to retrieve notifications" });
    }
  }

  // PATCH /api/notifications/:id/read
  async markAsRead(req, res) {
    const userId = req.user?.id;
    const notificationId = parseInt(req.params.id, 10);

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User ID not found" });
    }
    if (isNaN(notificationId)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    try {
      const updatedNotification =
        await notificationService.markNotificationAsRead(
          userId,
          notificationId
        );
      if (!updatedNotification) {
        return res
          .status(404)
          .json({ error: "Notification not found or already marked as read" });
      }
      res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Error in NotificationController.markAsRead:", error);
      res
        .status(500)
        .json({
          error: error.message || "Failed to mark notification as read",
        });
    }
  }

  // PATCH /api/notifications/read-all
  async markAllAsRead(req, res) {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User ID not found" });
    }

    try {
      const count = await notificationService.markAllNotificationsAsRead(
        userId
      );
      res
        .status(200)
        .json({
          message: `Successfully marked ${count} notifications as read.`,
        });
    } catch (error) {
      console.error("Error in NotificationController.markAllAsRead:", error);
      res
        .status(500)
        .json({
          error: error.message || "Failed to mark all notifications as read",
        });
    }
  }

}

module.exports = new NotificationController();
