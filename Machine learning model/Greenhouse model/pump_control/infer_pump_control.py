import joblib
import pandas as pd

model = joblib.load("models/model_rf.pkl")
scaler = joblib.load("models/scaler.pkl")
column_means = joblib.load("models/column_means.pkl")
column_order = joblib.load("models/column_order.pkl")

def predict_with_partial_input(partial_input: dict) -> str:
    full_input = column_means.copy()
    full_input.update(partial_input)
    ordered_input = full_input[column_order]
    input_scaled = scaler.transform(pd.DataFrame([ordered_input]))
    prediction = model.predict(input_scaled)[0]
    return "BẬT" if prediction == 1 else "TẮT"

input_data = {
    "Soil Moisture": 80,
    "Temperature": 10,
    "Air humidity (%)": 21
}
result = predict_with_partial_input(input_data)
print("Dự đoán: ", result)
