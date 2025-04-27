import joblib
import pandas as pd
import sys
import json
import os

# Xác định đường dẫn
script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")

# Tải model và các file cần thiết
try:
    model_path = os.path.join(models_dir, "model_rf.pkl")
    scaler_path = os.path.join(models_dir, "scaler.pkl")
    column_means_path = os.path.join(
        models_dir, "column_means.pkl"
    )  # Pump cũng dùng means
    column_order_path = os.path.join(models_dir, "column_order.pkl")

    if not all(
        os.path.exists(p)
        for p in [model_path, scaler_path, column_means_path, column_order_path]
    ):
        raise FileNotFoundError(
            "One or more model files not found in models directory."
        )

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    column_means = joblib.load(column_means_path)
    column_order = joblib.load(column_order_path)
except FileNotFoundError as e:
    print(f"Error loading model file: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error during model loading: {e}", file=sys.stderr)
    sys.exit(1)


def predict_pump_on(
    partial_input: dict, model, scaler, column_means, column_order
) -> str:
    try:
        # Tạo dict đầy đủ, điền giá trị thiếu bằng means
        full_input = column_means.copy()
        # Chuyển đổi kiểu dữ liệu của partial_input trước khi update
        partial_input_processed = {
            key: float(value)
            for key, value in partial_input.items()
            if key in column_order
        }
        full_input.update(partial_input_processed)

        # Đảm bảo đúng thứ tự cột
        # Kiểm tra xem tất cả các cột cần thiết có trong full_input không
        missing_keys = [key for key in column_order if key not in full_input]
        if missing_keys:
            raise KeyError(
                f"Input data missing keys after processing means: {', '.join(missing_keys)}"
            )

        ordered_input_series = pd.Series(full_input)[column_order]
        input_df = pd.DataFrame([ordered_input_series])

        # Scale và dự đoán
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]
        return "BẬT" if int(prediction) == 1 else "TẮT"
    except KeyError as e:
        print(f"Error: Invalid key in input data or column order: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error converting input data to float: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during prediction: {e}", file=sys.stderr)
        sys.exit(1)


# Đọc dữ liệu từ command-line argument
if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data_json = sys.argv[1]
            input_data_dict = json.loads(input_data_json)
            # Đổi tên hàm gọi cho rõ ràng
            result = predict_pump_on(
                input_data_dict, model, scaler, column_means, column_order
            )
            print(result)  # In kết quả ra stdout
        except json.JSONDecodeError:
            print("Error: Invalid JSON input from argument", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            # predict_pump_on đã xử lý lỗi và in ra stderr
            sys.exit(1)
    else:
        # Cung cấp hướng dẫn sử dụng nếu không có argument
        # Nhớ cập nhật các key theo đúng yêu cầu của model pump
        print(
            'Usage: python infer_pump_control.py \'{"Soil Moisture": 70, "Temperature": 22, "Air humidity (%)": 55}\'',
            file=sys.stderr,
        )
        sys.exit(1)
