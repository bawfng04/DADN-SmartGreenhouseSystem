// filepath: d:\Projects\DADN\frontend\src\components\specific\ExampleComponent\NotificationTestComponent.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // Hoặc dùng fetch
import "./ExampleComponent.css"; // Tái sử dụng CSS nếu muốn

// Giả sử bạn đã định nghĩa các API endpoint này trong apis.js hoặc tương tự
// Nếu chưa, bạn cần định nghĩa chúng
const API_BASE_URL = "http://localhost:8000/api"; // Hoặc lấy từ .env
const GET_NOTIFICATIONS_API = `${API_BASE_URL}/notifications`;
const MARK_READ_API = (id) => `${API_BASE_URL}/notifications/${id}/read`; // API để đánh dấu 1 cái đã đọc
const MARK_ALL_READ_API = `${API_BASE_URL}/notifications/read-all`; // API để đánh dấu tất cả đã đọc

const NotificationTestComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Thông báo thành công

  // Hàm lấy token
  const getToken = () => localStorage.getItem("token");

  // Hàm fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(""); // Xóa thông báo cũ
    const token = getToken();
    if (!token) {
      setError("Chưa đăng nhập.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(GET_NOTIFICATIONS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Lỗi fetch notifications:", err);
      setError(
        err.response?.data?.error || // Sửa lại key lỗi nếu backend trả về khác
          err.message ||
          "Lỗi không xác định khi lấy notifications."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch notifications khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Hàm đánh dấu đã đọc 1 notification
  const handleMarkRead = async (id) => {
    setIsLoading(true); // Có thể thêm loading riêng cho từng item
    setError(null);
    setMessage("");
    const token = getToken();
    if (!token) {
      setError("Chưa đăng nhập.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.patch(
        MARK_READ_API(id),
        {}, // Body rỗng cho PATCH
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Notification ID: ${id} đã được đánh dấu đã đọc.`);
      // Cập nhật lại trạng thái is_read trong list hoặc fetch lại toàn bộ
      // Cách 1: Cập nhật cục bộ (nhanh hơn)
      setNotifications((prev) =>
        prev.map((noti) => (noti.id === id ? { ...noti, is_read: true } : noti))
      );
      setIsLoading(false); // Kết thúc loading
      // Cách 2: Fetch lại (đảm bảo dữ liệu mới nhất từ server)
      // fetchNotifications();
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Lỗi không xác định khi đánh dấu đã đọc."
      );
      setIsLoading(false);
    }
  };

  // Hàm đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    setIsLoading(true);
    setError(null);
    setMessage("");
    const token = getToken();
    if (!token) {
      setError("Chưa đăng nhập.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        MARK_ALL_READ_API,
        {}, // Body rỗng
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message || "Đã đánh dấu tất cả đã đọc."); // Lấy message từ backend
      // Fetch lại danh sách để cập nhật trạng thái
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Lỗi không xác định khi đánh dấu tất cả đã đọc."
      );
      setIsLoading(false); // Chỉ set false khi lỗi, vì fetchNotifications sẽ set lại
    }
  };

  return (
    <div className="adafruit-component">
      {" "}
      {/* Tái sử dụng class */}
      <h2>Notifications</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className="error">Lỗi: {error}</p>}
      <button
        onClick={fetchNotifications}
        disabled={isLoading}
        style={{ marginRight: "10px" }}
      >
        {isLoading ? "Đang tải..." : "Tải lại Notifications"}
      </button>
      <button onClick={handleMarkAllRead} disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
      </button>
      {isLoading && notifications.length === 0 && <p>Đang tải...</p>}
      {!isLoading && notifications.length === 0 && !error && (
        <p>Không có thông báo nào.</p>
      )}
      {!isLoading && notifications.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
          {notifications.map((noti) => (
            <li
              key={noti.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: noti.is_read ? "#f0f0f0" : "#fff",
                opacity: noti.is_read ? 0.7 : 1,
              }}
            >
              <p>
                <strong>ID:</strong> {noti.id}
              </p>
              <p>
                <strong>Loại:</strong> {noti.type}
              </p>
              <p>
                <strong>Nội dung:</strong> {noti.message}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(noti.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {noti.is_read ? "Đã đọc" : "Chưa đọc"}
              </p>
              {!noti.is_read && (
                <button
                  onClick={() => handleMarkRead(noti.id)}
                  disabled={isLoading}
                  style={{ marginTop: "5px" }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationTestComponent;
