import joblib
import pandas as pd
import sys
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")  # Đường dẫn đến thư mục models

# Tải model
try:
    # Kiểm tra xem các file có tồn tại không
    model_path = os.path.join(models_dir, "model_rf.pkl")
    scaler_path = os.path.join(models_dir, "scaler.pkl")
    column_order_path = os.path.join(models_dir, "column_order.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler file not found: {scaler_path}")
    if not os.path.exists(column_order_path):
        raise FileNotFoundError(f"Column order file not found: {column_order_path}")

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    column_order = joblib.load(column_order_path)  # ['tempreature', 'humidity']
except FileNotFoundError as e:
    print(f"Error loading model file: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error during model loading: {e}", file=sys.stderr)
    sys.exit(1)


def predict_fan(input_dict: dict, model, scaler, column_order):
    # Đảm bảo input_dict có đủ key cần thiết trong column_order
    try:
        # Chuyển đổi kiểu dữ liệu nếu cần (ví dụ từ string sang float)
        input_dict_processed = {
            key: float(value)
            for key, value in input_dict.items()
            if key in column_order
        }

        # Kiểm tra thiếu key sau khi xử lý
        missing_keys = [key for key in column_order if key not in input_dict_processed]
        if missing_keys:
            raise KeyError(f"Missing required input keys: {', '.join(missing_keys)}")

        # Tạo DataFrame với thứ tự cột chính xác
        input_df = pd.DataFrame([input_dict_processed])[column_order]
    except KeyError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)  # Thoát với mã lỗi
    except ValueError as e:
        print(f"Error converting input data to float: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error preparing DataFrame: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]
        # Đảm bảo prediction là 0 hoặc 1
        return "BẬT" if int(prediction) == 1 else "TẮT"
    except Exception as e:
        print(f"Error during scaling or prediction: {e}", file=sys.stderr)
        sys.exit(1)


# Đọc dữ liệu từ command-line argument thứ 2 (index 1)
if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data_json = sys.argv[1]
            input_data_dict = json.loads(input_data_json)  # Parse JSON string
            result = predict_fan(input_data_dict, model, scaler, column_order)
            print(result)  # In kết quả ra stdout
        except json.JSONDecodeError:
            print("Error: Invalid JSON input from argument", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            # predict_fan đã xử lý lỗi và in ra stderr, chỉ cần exit
            # print(f"Error during prediction execution: {e}", file=sys.stderr)
            sys.exit(1)  # Thoát nếu có lỗi từ predict_fan
    else:
        print(
            'Usage: python infer_fan_control.py \'{"tempreature": 25, "humidity": 30}\'',
            file=sys.stderr,
        )
        sys.exit(1)  # Thoát nếu không có argument
