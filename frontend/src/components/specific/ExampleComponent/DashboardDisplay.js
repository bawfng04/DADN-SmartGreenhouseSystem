import React, { useState, useEffect } from "react";
import axios from "axios"; // Giả sử bạn dùng axios, nếu dùng fetch thì thay đổi tương ứng
// import "./DashboardDisplay.css";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner"; // Import component loading

const API_URL = "http://localhost:8000/api"; // Lấy URL API từ .env

function DashboardDisplay() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State cho ngày được chọn

  // Hàm lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const formattedDate = getFormattedDate(selectedDate); // Lấy ngày đã định dạng

      if (!token) {
        setError("Authentication token not found. Please login.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/dashboard/${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        );
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]); // Fetch lại dữ liệu khi selectedDate thay đổi

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  return (
    <div className="dashboard-display">
      <h2>Dashboard Data</h2>
      <div className="date-selector">
        <label htmlFor="dashboard-date">Select Date: </label>
        <input
          type="date"
          id="dashboard-date"
          value={getFormattedDate(selectedDate)}
          onChange={handleDateChange}
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <p className="error-message">Error: {error}</p>}
      {dashboardData && !isLoading && !error && (
        <div className="data-container">
          {/* Hiển thị dữ liệu dạng JSON để test */}
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>

          {/* Bạn có thể thêm biểu đồ ở đây sau này */}
          {/* Ví dụ:
          <div>
            <h3>Temperature</h3>
            {dashboardData.temperature.map(item => <p key={item.label}>{item.label}h: {item.value}°C</p>)}
          </div>
          */}
        </div>
      )}
      {!dashboardData && !isLoading && !error && (
        <p>No data available for the selected date.</p>
      )}
    </div>
  );
}

export default DashboardDisplay;
