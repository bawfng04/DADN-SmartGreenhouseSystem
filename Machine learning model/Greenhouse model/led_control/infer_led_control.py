import joblib
import pandas as pd

model = joblib.load("models/model_rf.pkl")
scaler = joblib.load("models/scaler.pkl")
column_means = joblib.load("models/column_means.pkl")
column_order = joblib.load("models/column_order.pkl")

def predict_led_on(partial_input: dict) -> str:
    full_input = column_means.copy()
    full_input.update(partial_input)

    ordered_input = full_input[column_order]

    input_scaled = scaler.transform(pd.DataFrame([ordered_input]))
    prediction = model.predict(input_scaled)[0]

    return "BẬT" if prediction == 1 else "TẮT"

input_data = {
    "Light_Intensity": 500,
    "Temperature": 21.5,
    "Humidity": 67,
    "Minute_Of_Day": 510  # 8:30 sáng
}

result = predict_led_on(input_data)
print(f"Kết quả dự đoán LED: {result}")
