## 🌿 Greenhouse Model – Smart Control System

Hệ thống mô phỏng điều khiển thông minh các thiết bị trong nhà kính: **quạt (fan)**, **bơm tưới (pump)** và **đèn LED (led)** dựa trên dữ liệu cảm biến môi trường. Dự án sử dụng mô hình học máy `RandomForestClassifier`.

---

## 📁 Cấu trúc thư mục

```
Greenhouse model/
├── fan_control/
│   ├── data/                                   # Dữ liệu fan (quạt)
│   │   └── IoTProcessed_Data.csv
│   ├── models/                                 # Mô hình và scaler cho fan
│   │   ├── model_rf.pkl
│   │   ├── scaler.pkl
│   │   └── column_order.pkl
│   ├── infer_fan_control.py                    # Dự đoán trạng thái quạt
│   └── train_model_fan_control.py              # Train mô hình quạt

├── led_control/
│   ├── data/
│   │   └── Greenhouse_LED_Dataset__Complex_.csv
│   ├── models/
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   ├── column_order.pkl
│   │   └── column_means.pkl
│   ├── infer_led_control.py
│   └── train_model_led_control.py

├── pump_control/
│   ├── data/
│   │   └── TARP.csv
│   ├── models/
│   │   ├── model_rf.pkl
│   │   ├── scaler.pkl
│   │   ├── column_means.pkl
│   │   └── column_order.pkl
│   ├── infer_pump_control.py
│   └── train_model_pump_control.py

└── README.md
```

---

## 🚀 Cách sử dụng

### 1. Cài đặt thư viện

```bash
pip install pandas scikit-learn joblib numpy
```

---

### 2. Chạy file huấn luyện (train model)

Chạy riêng từng module nếu cần retrain:

```bash
python train_model_fan_control.py
python train_model_pump_control.py
python train_model_led_control.py
```

---

### 3. Dự đoán thiết bị bật/tắt từ cảm biến

#### 💧 Pump Control

```python
# infer_pump_control.py
input_data = {
    "Soil Moisture": 80,
    "Temperature": 10,
    "Air humidity (%)": 21
}
```

#### 🌬 Fan Control

```python
# infer_fan_control.py
input_data = {
    "tempreature": 25,
    "humidity": 30
}
```

#### 🔦 LED Control

```python
# infer_led_control.py
input_data = {
    "Light_Intensity": 500,
    "Temperature": 21.5,
    "Humidity": 67,
    "Minute_Of_Day": 510  # tức 8:30 sáng
}
```

Sau khi chạy, terminal sẽ in ra:

```
Kết quả dự đoán: BẬT / TẮT
```
