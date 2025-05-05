const NotificationModel = require("../models/NotificationModel");

class NotificationRepository {
  constructor() {
    this.notificationModel = new NotificationModel();
  }

  async create(userId, message, type, isRead = false, related_entity_id = "") {
    try {
      return await this.notificationModel.createNotification(
        userId,
        message,
        type,
        isRead,
        related_entity_id
      );
    } catch (error) {
      console.log("Error in create [NotificationRepository]");
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await this.notificationModel.getAllNotifications(userId);
    } catch (error) {
      console.log("Error in findByUserId [NotificationRepository]");
      throw error;
    }
  }

  async markAsRead(userId, notificationId) {
    try {
      return await this.notificationModel.markAsRead(userId, notificationId);
    } catch (error) {
      console.log("Error in markAsRead [NotificationRepository]");
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      return await this.notificationModel.markAllAsRead(userId)
    } catch (error) {
      console.log("Error in markAllAsRead [NotificationRepository]");
      throw error;
    }
  }
}

module.exports = new NotificationRepository();