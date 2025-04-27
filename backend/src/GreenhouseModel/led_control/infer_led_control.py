import sys
import json
import joblib
import pandas as pd
import os
import traceback

# Xác định đường dẫn (giữ nguyên)
script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")

try:
    # *** SỬA TÊN FILE CHO ĐÚNG VỚI FILE THỰC TẾ (.pkl) ***
    model_path = os.path.join(models_dir, "model_rf.pkl")  # Sửa thành model_rf.pkl
    scaler_path = os.path.join(models_dir, "scaler.pkl")  # Sửa thành scaler.pkl
    columns_path = os.path.join(
        models_dir, "column_order.pkl"
    )  # Sửa thành column_order.pkl
    means_path = os.path.join(
        models_dir, "column_means.pkl"
    )  # Sửa thành column_means.pkl

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    column_order = joblib.load(columns_path)
    # column_means = joblib.load(means_path) # Bỏ comment dòng này nếu bạn cần dùng means

    # Đọc input JSON (giữ nguyên)
    if len(sys.argv) < 2:
        print("Error: Missing input JSON argument.", file=sys.stderr)
        sys.exit(1)

    input_json = sys.argv[1]
    input_dict = json.loads(input_json)

    # Tạo DataFrame (giữ nguyên)
    input_df = pd.DataFrame([input_dict])

    # Đảm bảo đúng thứ tự cột và kiểu dữ liệu (giữ nguyên)
    for col in column_order:
        if col not in input_df.columns:
            # Xử lý nếu thiếu cột (có thể dùng giá trị trung bình đã lưu)
            # print(f"Warning: Missing column '{col}', using default/mean value.", file=sys.stderr)
            # input_df[col] = column_means[col] # Ví dụ dùng mean
            print(f"Error: Missing required input column '{col}'.", file=sys.stderr)
            sys.exit(1)
        try:
            if pd.api.types.is_string_dtype(input_df[col]):
                input_df[col] = pd.to_numeric(input_df[col])
        except ValueError:
            print(
                f"Error: Could not convert column '{col}' value '{input_df[col].iloc[0]}' to numeric.",
                file=sys.stderr,
            )
            sys.exit(1)

    # Sắp xếp lại cột (giữ nguyên)
    input_df = input_df[column_order]

    # Chuẩn hóa dữ liệu (giữ nguyên)
    input_scaled = scaler.transform(input_df)

    # Dự đoán (giữ nguyên)
    prediction = model.predict(input_scaled)
    prediction_result = prediction[0]

    # In kết quả (giữ nguyên)
    print(prediction_result)

# Các khối except giữ nguyên
except FileNotFoundError as e:
    print(f"Error: File not found - {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input - {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
except KeyError as e:
    print(f"Error: Missing key in input data during processing - {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
except ValueError as e:
    print(f"Error: Data type/value error during processing - {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"An unexpected error occurred in Python script: {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
