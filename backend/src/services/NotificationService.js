const notificationRepository = require("../repository/NotificationRepository");

class NotificationService {
  async createNotification(userId, message, type, related_entity_id = "") {
    if (!userId || !message || !type) {
      throw new Error("Missing required paremeters for creating notification");
    }
    try {
      const notification = await notificationRepository.create(
        userId,
        message,
        type,
        false,
        related_entity_id
      );
      return notification;
    } catch (error) {
      console.error("Error in NotificationService.createNotification:", error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  async getNotificationsForUser(userId) {
    if (!userId) {
      throw new Error("User ID is required to get notifications.");
    }
    try {
      return await notificationRepository.findByUserId(userId); // ~ getAllNotìications
    } catch (error) {
      console.error(
        "Error in NotificationService.getNotificationsForUser:",
        error
      );
      throw new Error(`Failed to retrieve notifications: ${error.message}`);
    }
  }

  async markNotificationAsRead(userId, notificationId) {
    if (!userId || !notificationId) {
      throw new Error("User ID and Notification ID are required.");
    }
    try {
      const updatedNotification = await notificationRepository.markAsRead(
        userId,
        notificationId
      );
      if (!updatedNotification) {
        console.warn(
          `Notification ${notificationId} not found for user ${userId} or already read.`
        );
        return null;
      }
      return updatedNotification;
    } catch (error) {
      console.error(
        "Error in NotificationService.markNotificationAsRead:",
        error
      );
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  async markAllNotificationsAsRead(userId) {
    if (!userId) {
      throw new Error("User ID is required.");
    }
    try {
      // The repository method already handles the logic
      const count = await notificationRepository.markAllAsRead(userId);
      return count;
    } catch (error) {
      console.error(
        "Error in NotificationService.markAllNotificationsAsRead:",
        error
      );
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`
      );
    }
  }
}

module.exports = new NotificationService();

