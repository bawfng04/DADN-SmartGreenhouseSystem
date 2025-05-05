const { pool } = require("../database/PostgreDatabase");

// CREATE TABLE public.notifications (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     message TEXT NOT NULL,
//     type VARCHAR(50), -- 'DEVICE_UPDATE', 'SENSOR_ALERT', 'SCHEDULE_COMPLETED', 'REMINDER'...
//     is_read BOOLEAN DEFAULT FALSE,
//     related_entity_id VARCHAR(255), -- ID hoặc tên của thiết bị/sensor/lịch trình liên quan (tùy chọn)
//     timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE -- xoá user -> xoá notification của user
// );

class NotificationModel {
    async createNotification(user_id, message, type, is_read = false, related_entity_id = "") {
        try {
            const query = `
            INSERT INTO notifications
            (user_id, message, type, is_read, related_entity_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
            // const now = new Date();
            const result = await pool.query(query, [user_id, message, type, is_read, related_entity_id]);
            if (result.rows && result.rows.length > 0) {
                return result[0]; // thằng mới tạo
            }
            else {
                console.log("Failed to create new notification");
                throw new Error("Failed to create new notification")
            }
        }
        catch (error) {
            console.log("Error creating notification at NotificationModel.js");
            throw new Error(
              "Error creating notification at NotificationModel.js"
            );
        }
    }

    async getAllNotifications(userId) {
        try {
            const query = `
            SELECT * FROM notifications
            WHERE user_id = $1
            ORDER BY timestamp DESC
            `
            const values = [userId];
            const result = await pool.query(query, values);
            return result.rows; // cái mảng mấy cái vừa lấy
        }
        catch (error) {
            console.log("Error getAllNotifications:", error.message);
            throw new Error("Error getAllNotifications");
        }
    }

    async markAsRead(userId, notificationId) {
        try {
            const query = `
                UPDATE notifications SET is_read = TRUE
                WHERE id = $1 AND user_id = $2 AND is_read = FALSE
                RETURNING *
            `
            const values = [notificationId, userId]
            const result = await pool.query(query, values);
            if (result.rows && result.rows.length > 0) {
                return result.rows[0];
            }
            else {
                throw new Error("Error mark as read", error.message);
            }
        }
        catch (error) {
            console.log("Error mark notification", error.message);
            throw new Error("Error mark notification");
        }
    }

    async markAllAsRead(userId) {
        try {
            const query = `
            UPDATE notifications SET is_read = TRUE
            WHERE user_id = $1 AND is_read = FALSE
            RETURNING id
            `
            const values = [userId];
            const result = await pool.query(query, values);
            if (result.rows && result.rows.length > 0) {
                return result.rowCount; // số lượng thông báo đánh dấu đã đọc
            }
            else {
                throw new Error("Error mark all as read", error.message);
            }
        }
        catch (error) {
            console.log("Error mark all notification as read", error.message);
            throw new Error("Error mark all notification as read");
        }
    }
}

module.exports = NotificationModel