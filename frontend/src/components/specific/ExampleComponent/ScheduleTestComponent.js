import React, { useState } from "react";
import { createScheduleAPI } from "../../../apis"; // Giả sử bạn định nghĩa API này trong apis.js
import "./ExampleComponent.css"; // Tái sử dụng CSS nếu muốn

const token = localStorage.getItem("token");

const ScheduleTestComponent = () => {
  const [feedKey, setFeedKey] = useState("light-control"); // Giá trị mặc định
  const [payload, setPayload] = useState("0"); // Giá trị mặc định
  const [delayMinutes, setDelayMinutes] = useState(1); // Giá trị mặc định (1 phút)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFeedKeyChange = (e) => {
    const newFeedKey = e.target.value;
    setFeedKey(newFeedKey);
    // Reset payload khi đổi feed key để tránh giá trị không hợp lệ
    if (newFeedKey === "light-control") {
      setPayload("0"); // Mặc định là OFF
    } else {
      setPayload("50"); // Mặc định là 50%
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    // --- Validation ---
    const delayNum = parseInt(delayMinutes, 10);
    if (isNaN(delayNum) || delayNum <= 0) {
      setError("Delay must be a positive number of minutes.");
      setLoading(false);
      return;
    }

    let finalPayload = payload;
    if (feedKey === "fan" || feedKey === "water-pump") {
      const payloadNum = parseInt(payload, 10);
      if (isNaN(payloadNum) || payloadNum < 0 || payloadNum > 100) {
        setError("Payload for Fan/Pump must be between 0 and 100.");
        setLoading(false);
        return;
      }
      finalPayload = String(payloadNum);
    } else if (feedKey === "light-control") {
      if (payload !== "0" && payload !== "1") {
        setError("Payload for Light Control must be 0 (OFF) or 1 (ON).");
        setLoading(false);
        return;
      }
    } else {
      setError("Invalid Feed Key selected."); // Trường hợp không mong muốn
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(createScheduleAPI, {
        // Sử dụng API endpoint từ apis.js
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedKey: feedKey,
          payload: finalPayload,
          delayMinutes: delayNum,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      setMessage(
        `Schedule created successfully! Task ID: ${result.scheduleId}. Action will run in ${delayNum} minute(s).`
      );
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError(err.message || "Failed to create schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adafruit-component">
      {" "}
      {/* Tái sử dụng class để có style tương tự */}
      <h2>Schedule an Action</h2>
      <div className="device-control-card">
        {" "}
        {/* Tái sử dụng class */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="feedKey"
              style={{
                marginRight: "10px",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Device (Feed Key):
            </label>
            <select
              id="feedKey"
              value={feedKey}
              onChange={handleFeedKeyChange}
              required
              style={{ padding: "8px", width: "100%" }}
            >
              <option value="light-control">Light Control</option>
              <option value="fan">Fan</option>
              <option value="water-pump">Water Pump</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="payload"
              style={{
                marginRight: "10px",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Value (Payload):
              {feedKey === "light-control" ? " (0=OFF, 1=ON)" : " (0-100)"}
            </label>
            <input
              type="text" // Dùng text để linh hoạt, validation sẽ xử lý sau
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              required
              style={{ padding: "8px", width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="delayMinutes"
              style={{
                marginRight: "10px",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Delay (minutes):
            </label>
            <input
              type="number"
              id="delayMinutes"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(e.target.value)}
              // min="1"
              required
              style={{ padding: "8px", width: "100%" }}
            />
          </div>

          <button
            type="submit"
            className="control-button"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Scheduling..." : "Create Schedule"}
          </button>
        </form>
        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
        )}
        {error && (
          <p className="error" style={{ marginTop: "10px" }}>
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduleTestComponent;
