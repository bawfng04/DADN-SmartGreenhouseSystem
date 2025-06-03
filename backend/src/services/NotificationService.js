const notificationRepository = require("../repository/NotificationRepository");
const reminderRepository = require("../repository/reminderRepository");
// const {getLatestSensorDataForAllFeeds} = require("../repository/sensorRepository");
const { sensorService } = require("./sensorService");

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

  // 06 05 2025
  async checkAndTriggerReminders() {
    try {
      console.log("[ReminderCheck] Checking for reminder triggers...");
      const activeReminders = await reminderRepository.getActiveReminders();
      if (!activeReminders || activeReminders.length === 0) {
        console.log("[ReminderCheck] No active reminders found.");
        return;
      }

      // lấy dữ liệu cảm biến mới nhất
      const latestSensorData =
        await sensorService.getLatestSensorDataForAllFeeds();
      if (!latestSensorData || Object.keys(latestSensorData).length === 0) {
        console.warn(
          "[ReminderCheck] No sensor data available to check reminders."
        );
        return;
      }
      console.log("[ReminderCheck] Latest sensor data:", latestSensorData);

      // mapping layer
      const mappedSensorData = {
        temperature: latestSensorData.thermal,
        humidity: latestSensorData.humid,
        soil_moisture: latestSensorData["earth-humid"],
        light: latestSensorData.light,
      };
      console.log("[ReminderCheck] Mapped sensor data:", mappedSensorData);

      for (const reminder of activeReminders) {
        const sensorValueStr = mappedSensorData[reminder.index_name]; // ví dụ: reminder.index_name là 'temperature'

        if (sensorValueStr === undefined || sensorValueStr === null) {
          console.log(
            `[ReminderCheck] No data for ${reminder.index_name} to check reminder ${reminder.id}`
          );
          continue;
        }
        const sensorValue = parseFloat(sensorValueStr);
        if (isNaN(sensorValue)) {
          console.warn(
            `[ReminderCheck] Invalid sensor value for ${reminder.index_name}: ${sensorValueStr}`
          );
          continue;
        }

        let triggered = false;
        let message = "";

        if (
          reminder.higher_than_status &&
          sensorValue > parseFloat(reminder.higher_than_value)
        ) {
          triggered = true;
          message = `Alert: ${reminder.index_name} (${sensorValue}) is above the threshold of ${reminder.higher_than_value}.`;
        } else if (
          reminder.lower_than_status &&
          sensorValue < parseFloat(reminder.lower_than_value)
        ) {
          triggered = true;
          message = `Alert: ${reminder.index_name} (${sensorValue}) is below the threshold of ${reminder.lower_than_value}.`;
        }

        if (triggered) {
          const now = new Date();
          if (
            reminder.repeat_after_status &&
            reminder.last_triggered_at &&
            reminder.repeat_after_value > 0
          ) {
            const lastTriggeredTime = new Date(reminder.last_triggered_at);
            const diffMinutes =
              (now.getTime() - lastTriggeredTime.getTime()) / (1000 * 60);

            if (diffMinutes < reminder.repeat_after_value) {
              console.log(
                `[ReminderCheck] Reminder ${reminder.id} for ${
                  reminder.index_name
                } (User ${
                  reminder.user_id
                }) already triggered within repeat interval of ${
                  reminder.repeat_after_value
                } mins. Waited ${diffMinutes.toFixed(1)} mins.`
              );
              continue; // Bỏ qua nếu vẫn trong thời gian chờ lặp lại
            }
          }

          console.log(
            `[ReminderCheck] Triggering reminder for user ${reminder.user_id}: ${message}`
          );
          try {
            await this.createNotification(
              reminder.user_id,
              message,
              "REMINDER_ALERT",
              reminder.index_name
            );
            await reminderRepository.updateReminderLastTriggered(reminder.id); // Cập nhật thời gian trigger cuối
            console.log(
              `[Notification] Created REMINDER_ALERT for user ${reminder.user_id} - ${reminder.index_name}`
            );
          } catch (notificationError) {
            console.error(
              `[Notification] Failed to create REMINDER_ALERT for user ${reminder.user_id} - ${reminder.index_name}:`,
              notificationError
            );
          }
        }
      }
    } catch (error) {
      console.error("[ReminderCheck] Error during reminder check:", error);
    }
  }
}

module.exports = new NotificationService();

