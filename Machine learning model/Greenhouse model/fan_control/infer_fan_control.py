import joblib
import pandas as pd

model = joblib.load("models/model_rf.pkl")
scaler = joblib.load("models/scaler.pkl")
column_order = joblib.load("models/column_order.pkl")

def predict_fan(input_dict: dict, model, scaler, column_order):
    input_df = pd.DataFrame([input_dict])[column_order]
    input_scaled = scaler.transform(input_df)
    prediction = model.predict(input_scaled)[0]
    return "BẬT" if prediction == 1 else "TẮT"

input_data = {"tempreature": 25, "humidity": 30}
result = predict_fan(input_data, model, scaler, column_order)
print(f"Dự đoán từ sensor: {result}")
