import joblib
import pandas as pd
import sys
import json
import os
import traceback

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")

try:
    model_path = os.path.join(models_dir, "model_rf.pkl")
    scaler_path = os.path.join(models_dir, "scaler.pkl")
    column_means_path = os.path.join(models_dir, "column_means.pkl")
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

    if len(sys.argv) < 2:
        print("Error: Missing input JSON argument.", file=sys.stderr)
        sys.exit(1)

    input_json = sys.argv[1]
    input_dict = json.loads(input_json)

    # Pump uses means for missing values
    full_input = column_means.copy()
    partial_input_processed = {}
    for key, value in input_dict.items():
        if key in column_order:
            try:
                partial_input_processed[key] = float(value)
            except ValueError:
                print(
                    f"Error: Could not convert input value '{value}' for key '{key}' to float.",
                    file=sys.stderr,
                )
                sys.exit(1)

    full_input.update(partial_input_processed)

    missing_keys = [key for key in column_order if key not in full_input]
    if missing_keys:
        print(
            f"Error: Input data missing keys after processing means: {', '.join(missing_keys)}",
            file=sys.stderr,
        )
        sys.exit(1)

    ordered_input_series = pd.Series(full_input)[column_order]
    input_df = pd.DataFrame([ordered_input_series])

    input_scaled = scaler.transform(input_df)

    prediction = model.predict(input_scaled)
    prediction_result = prediction[0]

    # Pump model predicts 0 or 1, convert to TẮT/BẬT
    output_result = "BẬT" if int(prediction_result) == 1 else "TẮT"
    print(output_result)

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
