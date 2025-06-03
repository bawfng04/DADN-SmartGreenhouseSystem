import { useState, useEffect } from "react";
import { exampleAPI } from "../../../apis";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Notification from "../../common/Notification/Notification";
import ScheduleTestComponent from "./ScheduleTestComponent";
import DashboardDisplay from "./DashboardDisplay";
import "./ExampleComponent.css";
import IndicesDisplay from "./IndicesDisplay";
import ReminderManager from "./ReminderManager";
import NotificationTestComponent from "./NotificationTestComponent";
// lấy data từ adafruit của BE
import {
  adafruitThermal,
  adafruitLight,
  adafruitEarthHumid,
  adafruitHumid,
  // Các endpoint này giờ sẽ bao gồm cả GET và POST theo convention của backend
  adafruitFan, // Ví dụ: /api/device/fan (Backend xử lý GET và POST trên cùng route)
  adafruitWaterPump, // Ví dụ: /api/device/water-pump
  adafruitLightControl, // Ví dụ: /api/device/light-control
} from "../../../apis";
import AdafruitDataCard from "./Adafruit";

const token = localStorage.getItem("token");

const ExampleComponent = () => {
  const [data, setData] = useState([]);
  // Sensor states
  const [thermal, setThermal] = useState([]);
  const [light, setLight] = useState([]);
  const [earthHumid, setEarthHumid] = useState([]);
  const [humidity, setHumidity] = useState([]);

  // Device data history states
  const [fanDataHistory, setFanDataHistory] = useState([]);
  const [waterPumpDataHistory, setWaterPumpDataHistory] = useState([]);
  const [lightControlDataHistory, setLightControlDataHistory] = useState([]);

  // Control status/value state (lưu trữ giá trị điều khiển hiện tại/xác nhận)
  const [deviceStatus, setDeviceStatus] = useState({
    fan: 0, // Giá trị số từ 0-100
    waterPump: 0, // Giá trị số từ 0-100
    lightControl: false, // true for ON, false for OFF
  });

  // State để quản lý giá trị tạm thời của slider khi người dùng kéo
  const [sliderValues, setSliderValues] = useState({
    fan: 0,
    waterPump: 0,
  });

  // --- FetchExample (Giữ nguyên nếu cần) ---
  async function FetchExample() {
    // ... code FetchExample của bạn ...
    try {
      const response = await fetch(exampleAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`Example API failed: ${response.status}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching example data:", error);
      setData({ error: error.message }); // Hiển thị lỗi nếu cần
    }
  }

  // --- FetchAdaFruit (Cập nhật để lấy và xử lý trạng thái thiết bị) ---
  async function FetchAdaFruit() {
    try {
      console.log("Fetching Adafruit data...");

      // Initialize loading states
      setThermal({ loading: true });
      setLight({ loading: true });
      setEarthHumid({ loading: true });
      setHumidity({ loading: true });
      setFanDataHistory({ loading: true });
      setWaterPumpDataHistory({ loading: true });
      setLightControlDataHistory({ loading: true });

      // Gọi API GET cho tất cả các feed
      const [
        thermalRes,
        lightRes,
        earthHumidRes,
        humidRes,
        fanRes,
        waterPumpRes,
        lightControlRes,
      ] = await Promise.all([
        fetch(adafruitThermal, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(adafruitLight, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(adafruitEarthHumid, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(adafruitHumid, { headers: { Authorization: `Bearer ${token}` } }),
        // Giả sử các endpoint này hỗ trợ GET để lấy lịch sử/trạng thái mới nhất
        fetch(adafruitFan, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(adafruitWaterPump, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(adafruitLightControl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Check responses
      const responses = [
        thermalRes,
        lightRes,
        earthHumidRes,
        humidRes,
        fanRes,
        waterPumpRes,
        lightControlRes,
      ];
      for (const res of responses) {
        if (!res.ok)
          throw new Error(`API failed: ${res.url} status: ${res.status}`);
      }

      // Parse JSON
      const [
        thermalData,
        lightData,
        earthHumidData,
        humidData,
        fanHistory,
        waterPumpHistory,
        lightControlHistory,
      ] = await Promise.all(responses.map((res) => res.json()));

      // Set sensor states
      setThermal(thermalData);
      setLight(lightData);
      setEarthHumid(earthHumidData);
      setHumidity(humidData);

      // Set device history states
      setFanDataHistory(fanHistory);
      setWaterPumpDataHistory(waterPumpHistory);
      setLightControlDataHistory(lightControlHistory);

      // Update device status/value from the latest data
      try {
        let latestFanValue = deviceStatus.fan; // Giữ giá trị cũ nếu không có dữ liệu mới/lỗi
        if (Array.isArray(fanHistory) && fanHistory.length > 0) {
          const numericValue = parseInt(fanHistory[0].value, 10);
          if (!isNaN(numericValue)) {
            latestFanValue = Math.max(0, Math.min(100, numericValue)); // Clamp 0-100
          }
        }

        let latestWaterPumpValue = deviceStatus.waterPump;
        if (Array.isArray(waterPumpHistory) && waterPumpHistory.length > 0) {
          const numericValue = parseInt(waterPumpHistory[0].value, 10);
          if (!isNaN(numericValue)) {
            latestWaterPumpValue = Math.max(0, Math.min(100, numericValue)); // Clamp 0-100
          }
        }

        let latestLightStatus = deviceStatus.lightControl;
        if (
          Array.isArray(lightControlHistory) &&
          lightControlHistory.length > 0
        ) {
          // Backend trả về '1' là ON, '0' là OFF
          latestLightStatus = lightControlHistory[0].value === "1";
        }

        // Cập nhật trạng thái chính
        setDeviceStatus({
          fan: latestFanValue,
          waterPump: latestWaterPumpValue,
          lightControl: latestLightStatus,
        });
        // Đồng bộ giá trị slider với trạng thái mới nhất
        setSliderValues({
          fan: latestFanValue,
          waterPump: latestWaterPumpValue,
        });
      } catch (parseError) {
        console.error("Error parsing latest device status:", parseError);
      }
    } catch (error) {
      console.error("Error fetching Adafruit data:", error);
      // Set error states for all
      const errorState = { error: error.message };
      setThermal(errorState);
      setLight(errorState);
      setEarthHumid(errorState);
      setHumidity(errorState);
      setFanDataHistory(errorState);
      setWaterPumpDataHistory(errorState);
      setLightControlDataHistory(errorState);
    }
  }

  // --- Device control function (POST request) ---
  async function controlDevice(deviceEndpoint, value) {
    try {
      console.log(`Sending POST to ${deviceEndpoint} with value: ${value}`);
      const response = await fetch(deviceEndpoint, {
        // Sử dụng endpoint gốc (ví dụ: /api/device/fan)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Backend `createAdafruit...Data` nhận { value } trong body
        body: JSON.stringify({ value: String(value) }), // Gửi giá trị dạng string
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Device control failed: ${response.status} - ${
            errorBody || response.statusText
          }`
        );
      }
      console.log(`Device control success for ${deviceEndpoint}`);
      return await response.json(); // Trả về kết quả từ backend (nếu có)
    } catch (error) {
      console.error(`Error controlling device ${deviceEndpoint}:`, error);
      // Có thể hiển thị lỗi cho người dùng ở đây
      throw error; // Ném lỗi để hàm gọi xử lý
    }
  }

  // --- Handler functions for device controls ---

  // Cập nhật state của slider khi người dùng kéo
  const handleSliderChange = (device, value) => {
    setSliderValues((prev) => ({ ...prev, [device]: parseInt(value, 10) }));
  };

  // Gửi giá trị Fan khi người dùng thả slider
  const handleFanControl = async () => {
    const value = sliderValues.fan; // Lấy giá trị từ state slider tạm thời
    try {
      await controlDevice(adafruitFan, value); // Gọi POST API
      // Cập nhật trạng thái chính sau khi thành công
      setDeviceStatus((prev) => ({ ...prev, fan: value }));
      // Không cần gọi FetchAdaFruit() ngay, vì trạng thái đã được cập nhật cục bộ
      // Nếu muốn xác nhận lại từ server, có thể gọi FetchAdaFruit() sau một khoảng trễ ngắn
    } catch (error) {
      // Lỗi đã được log trong controlDevice, có thể thêm thông báo UI ở đây
      // Reset slider về giá trị cũ nếu thất bại?
      // setSliderValues(prev => ({ ...prev, fan: deviceStatus.fan }));
    }
  };

  // Gửi giá trị Water Pump khi người dùng thả slider
  const handleWaterPumpControl = async () => {
    const value = sliderValues.waterPump;
    try {
      await controlDevice(adafruitWaterPump, value); // Gọi POST API
      setDeviceStatus((prev) => ({ ...prev, waterPump: value }));
    } catch (error) {
      // Xử lý lỗi tương tự handleFanControl
    }
  };

  // Gửi giá trị Light Control khi nhấn nút
  const handleLightControl = async () => {
    const currentValue = deviceStatus.lightControl;
    const nextValue = currentValue ? "0" : "1"; // Tính toán giá trị ON/OFF tiếp theo
    try {
      await controlDevice(adafruitLightControl, nextValue); // Gọi POST API
      setDeviceStatus((prev) => ({ ...prev, lightControl: !currentValue })); // Đảo ngược trạng thái
    } catch (error) {
      // Xử lý lỗi tương tự
    }
  };

  // --- useEffect Hook ---
  useEffect(() => {
    FetchExample(); // Fetch data ví dụ
    FetchAdaFruit(); // Fetch data Adafruit lần đầu

    // Set up polling interval
    const intervalId = setInterval(FetchAdaFruit, 10000); // Giảm thời gian nếu cần

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []); // Chạy 1 lần khi mount

  // --- Render JSX ---
  return (
    <div className="example-component">
      {/* Phần Notification và Example Component Content giữ nguyên */}
      <div className="example-component-content">
        <Notification message="ExampleComponent is rendered!" />
        <h1>Example Component</h1>
        <p>API URL: {exampleAPI}</p>
        <ul>
          {data && Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index}>
                <p>-----</p>
                <li>{item.ID}</li>
                <li>{item.NAME}</li>
                <li>{item.AGE}</li>
              </div>
            ))
          ) : data && data.error ? (
            <p style={{ color: "red" }}>
              Error loading example data: {data.error}
            </p>
          ) : (
            <LoadingSpinner />
          )}
        </ul>
        {/* <LoadingSpinner /> Có thể bỏ nếu đã có check loading trong map */}
      </div>

      {/* Phần Sensor Data giữ nguyên */}
      <div className="adafruit-component">
        <h2>Sensor Data</h2>
        <div className="data-cards">
          <AdafruitDataCard title="Thermal Data" data={thermal} />
          <AdafruitDataCard title="Light Data" data={light} />
          <AdafruitDataCard title="Earth Humidity Data" data={earthHumid} />
          <AdafruitDataCard title="Humidity Data" data={humidity} />
        </div>
      </div>

      {/* Phần Device Control đã sửa đổi */}
      <div className="adafruit-component">
        <h2>Device Control</h2>
        <div className="device-controls">
          {/* --- Fan Control (Slider) --- */}
          <div className="device-control-card">
            <h3>Fan Control</h3>
            <div className="control-slider">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValues.fan} // Giá trị hiển thị trên slider
                onChange={(e) => handleSliderChange("fan", e.target.value)} // Cập nhật state tạm thời
                onMouseUp={handleFanControl} // Gửi giá trị khi thả chuột
                onTouchEnd={handleFanControl} // Gửi giá trị trên mobile
                className="slider"
                disabled={fanDataHistory.loading} // Disable khi đang load
              />
              <span className="slider-value">{sliderValues.fan}%</span>
            </div>
            <div className="device-status">
              {/* Hiển thị trạng thái cuối cùng được xác nhận từ state chính */}
              Status: <span>{deviceStatus.fan}%</span>
            </div>
            {/* Hiển thị lịch sử dữ liệu */}
            <AdafruitDataCard title="Fan Data History" data={fanDataHistory} />
          </div>

          {/* --- Water Pump Control (Slider) --- */}
          <div className="device-control-card">
            <h3>Water Pump Control</h3>
            <div className="control-slider">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValues.waterPump}
                onChange={(e) =>
                  handleSliderChange("waterPump", e.target.value)
                }
                onMouseUp={handleWaterPumpControl}
                onTouchEnd={handleWaterPumpControl}
                className="slider"
                disabled={waterPumpDataHistory.loading}
              />
              <span className="slider-value">{sliderValues.waterPump}%</span>
            </div>
            <div className="device-status">
              Status: <span>{deviceStatus.waterPump}%</span>
            </div>
            <AdafruitDataCard
              title="Water Pump Data History"
              data={waterPumpDataHistory}
            />
          </div>

          {/* --- Light Control (Button) --- */}
          <div className="device-control-card">
            <h3>Light Control</h3>
            <div className="control-buttons">
              <button
                className={`control-button ${
                  deviceStatus.lightControl ? "active" : ""
                }`}
                onClick={handleLightControl} // Gọi hàm xử lý POST
                disabled={lightControlDataHistory.loading}
              >
                {deviceStatus.lightControl ? "Turn Light Off" : "Turn Light On"}
              </button>
              <div className="device-status">
                Status:{" "}
                <span
                  className={
                    deviceStatus.lightControl ? "status-on" : "status-off"
                  }
                >
                  {deviceStatus.lightControl ? "ON" : "OFF"}
                </span>
              </div>
            </div>
            {/* Sử dụng state history đã đổi tên */}
            <AdafruitDataCard
              title="Light Control Data History"
              data={lightControlDataHistory}
            />
          </div>
        </div>
      </div>
      <ScheduleTestComponent />

      {/* Phần Refresh Section giữ nguyên */}
      <div className="refresh-section">
        <button className="refresh-button" onClick={FetchAdaFruit}>
          Refresh All Data
        </button>
        <p className="refresh-info">
          Data automatically refreshes every 10 seconds
        </p>
      </div>
      <div>
        =============================================================================
      </div>
      <div className="dashboard-display">
        <DashboardDisplay />
      </div>
      <div>
        =============================================================================
      </div>
      <div className="indices-display">
        <h2>Indices Data</h2>
        <IndicesDisplay />
      </div>
      <div>
        =============================================================================
      </div>
      <div className="reminder-manager">
        <h2>Reminder Manager</h2>
        <ReminderManager />
        <div>
          =============================================================================
        </div>
        <div className="notification-test">
          <h2>Notification Test</h2>
          <NotificationTestComponent />
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
