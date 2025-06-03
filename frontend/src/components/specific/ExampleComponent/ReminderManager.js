import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Giả sử API URL được cấu hình
const API_URL = "http://localhost:8000/api";

function ReminderManager() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Để hiển thị thông báo thành công

  // State cho form tạo mới
  const [newIndex, setNewIndex] = useState("temperature");
  const [newHigherThanStatus, setNewHigherThanStatus] = useState(false);
  const [newHigherThanValue, setNewHigherThanValue] = useState("");
  const [newLowerThanStatus, setNewLowerThanStatus] = useState(false);
  const [newLowerThanValue, setNewLowerThanValue] = useState("");
  const [newRepeatAfterStatus, setNewRepeatAfterStatus] = useState(false);
  const [newRepeatAfterValue, setNewRepeatAfterValue] = useState("");

  // Hàm lấy token
  const getToken = () => localStorage.getItem("token");

  // Hàm fetch reminders
  const fetchReminders = useCallback(async () => {
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
      const response = await axios.get(`${API_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(response.data || []);
    } catch (err) {
      console.error("Lỗi fetch reminders:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi không xác định khi lấy reminders."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch reminders khi component mount
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Hàm xử lý tạo reminder
  const handleCreateReminder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage("");
    const token = getToken();
    if (!token) {
      setError("Chưa đăng nhập.");
      setIsLoading(false);
      return;
    }

    const reminderData = {
      index: newIndex,
      higherThan: {
        status: newHigherThanStatus,
        value: newHigherThanStatus ? parseFloat(newHigherThanValue) : null,
      },
      lowerThan: {
        status: newLowerThanStatus,
        value: newLowerThanStatus ? parseFloat(newLowerThanValue) : null,
      },
      repeatAfter: {
        status: newRepeatAfterStatus,
        value: newRepeatAfterStatus ? parseInt(newRepeatAfterValue, 10) : null,
      },
    };

    // Validate values if statuses are true
    if (newHigherThanStatus && isNaN(reminderData.higherThan.value)) {
      setError("Giá trị 'Higher Than' không hợp lệ.");
      setIsLoading(false);
      return;
    }
    if (newLowerThanStatus && isNaN(reminderData.lowerThan.value)) {
      setError("Giá trị 'Lower Than' không hợp lệ.");
      setIsLoading(false);
      return;
    }
    if (newRepeatAfterStatus && isNaN(reminderData.repeatAfter.value)) {
      setError("Giá trị 'Repeat After' không hợp lệ.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/reminders`, reminderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Reminder đã được tạo thành công!");
      // Reset form
      setNewHigherThanStatus(false);
      setNewHigherThanValue("");
      setNewLowerThanStatus(false);
      setNewLowerThanValue("");
      setNewRepeatAfterStatus(false);
      setNewRepeatAfterValue("");
      // Fetch lại danh sách
      fetchReminders();
    } catch (err) {
      console.error("Lỗi tạo reminder:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi không xác định khi tạo reminder."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý xóa reminder
  const handleDeleteReminder = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa reminder ID: ${id}?`)) {
      return;
    }
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
      await axios.delete(`${API_URL}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Reminder ID: ${id} đã được xóa.`);
      // Fetch lại danh sách
      fetchReminders();
    } catch (err) {
      console.error("Lỗi xóa reminder:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi không xác định khi xóa reminder."
      );
      setIsLoading(false); // Chỉ set false khi có lỗi, vì fetchReminders sẽ set lại
    }
    // Không cần finally setIsLoading(false) vì fetchReminders sẽ làm
  };

  // Hàm xử lý toggle status
  const handleToggleStatus = async (id) => {
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
      await axios.patch(
        `${API_URL}/reminders/${id}/status`,
        {},
        {
          // Body rỗng cho PATCH status
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Trạng thái Reminder ID: ${id} đã được cập nhật.`);
      // Fetch lại danh sách
      fetchReminders();
    } catch (err) {
      console.error("Lỗi cập nhật status reminder:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi không xác định khi cập nhật status."
      );
      setIsLoading(false); // Chỉ set false khi có lỗi
    }
  };

  return (
    <div className="reminder-manager">
      <h1>Quản lý Reminders</h1>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">Lỗi: {error}</p>}

      {/* Form tạo mới */}
      <div className="create-reminder-form card">
        <h2>Tạo Reminder Mới</h2>
        <form onSubmit={handleCreateReminder}>
          <div className="form-group">
            <label htmlFor="index">Chỉ số (Index):</label>
            <select
              id="index"
              value={newIndex}
              onChange={(e) => setNewIndex(e.target.value)}
              required
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="soil_moisture">Soil Moisture</option>
              <option value="light">Light</option>
              {/* Thêm các index khác nếu cần */}
            </select>
          </div>

          <div className="form-group threshold-group">
            <input
              type="checkbox"
              id="higherThanStatus"
              checked={newHigherThanStatus}
              onChange={(e) => setNewHigherThanStatus(e.target.checked)}
            />
            <label htmlFor="higherThanStatus">Cảnh báo khi Lớn Hơn:</label>
            <input
              type="number"
              id="higherThanValue"
              value={newHigherThanValue}
              onChange={(e) => setNewHigherThanValue(e.target.value)}
              disabled={!newHigherThanStatus}
              placeholder="Giá trị"
              step="any"
            />
          </div>

          <div className="form-group threshold-group">
            <input
              type="checkbox"
              id="lowerThanStatus"
              checked={newLowerThanStatus}
              onChange={(e) => setNewLowerThanStatus(e.target.checked)}
            />
            <label htmlFor="lowerThanStatus">Cảnh báo khi Nhỏ Hơn:</label>
            <input
              type="number"
              id="lowerThanValue"
              value={newLowerThanValue}
              onChange={(e) => setNewLowerThanValue(e.target.value)}
              disabled={!newLowerThanStatus}
              placeholder="Giá trị"
              step="any"
            />
          </div>

          <div className="form-group threshold-group">
            <input
              type="checkbox"
              id="repeatAfterStatus"
              checked={newRepeatAfterStatus}
              onChange={(e) => setNewRepeatAfterStatus(e.target.checked)}
            />
            <label htmlFor="repeatAfterStatus">Lặp lại sau (giờ):</label>
            <input
              type="number"
              id="repeatAfterValue"
              value={newRepeatAfterValue}
              onChange={(e) => setNewRepeatAfterValue(e.target.value)}
              disabled={!newRepeatAfterStatus}
              placeholder="Số giờ"
              min="1"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Reminder"}
          </button>
        </form>
      </div>

      {/* Danh sách reminders */}
      <h2>Danh sách Reminders</h2>
      {isLoading && <p>Đang tải danh sách...</p>}
      {!isLoading && reminders.length === 0 && !error && (
        <p>Không có reminder nào.</p>
      )}
      {!isLoading && reminders.length > 0 && (
        <ul className="reminder-list">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className={`reminder-item card ${
                reminder.active ? "active" : "inactive"
              }`}
            >
              <p>
                <strong>ID:</strong> {reminder.id}
              </p>
              <p>
                <strong>Index:</strong> {reminder.index}
              </p>
              {reminder.higherThan !== undefined && (
                <p>
                  <strong>Cao hơn:</strong> {reminder.higherThan}
                </p>
              )}
              {reminder.lowerThan !== undefined && (
                <p>
                  <strong>Thấp hơn:</strong> {reminder.lowerThan}
                </p>
              )}
              {reminder.repeatAfter !== undefined && (
                <p>
                  <strong>Lặp lại sau:</strong> {reminder.repeatAfter} giờ
                </p>
              )}
              <p>
                <strong>Trạng thái:</strong>{" "}
                {reminder.active ? "Đang bật" : "Đã tắt"}
              </p>
              <div className="reminder-actions">
                <button
                  onClick={() => handleToggleStatus(reminder.id)}
                  disabled={isLoading}
                >
                  {reminder.active ? "Tắt" : "Bật"}
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReminder(reminder.id)}
                  disabled={isLoading}
                >
                  Xóa
                </button>
              </div>
              <div className="rawdata">
                <strong>Dữ liệu thô:</strong> {JSON.stringify(reminder)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReminderManager;
