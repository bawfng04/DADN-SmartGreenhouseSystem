import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
import joblib
import warnings
warnings.filterwarnings("ignore")

def load_and_preprocess_data(path: str):
    df = pd.read_csv(path, low_memory=False)
    df = df.rename(columns=lambda x: x.strip().lower()) 
    df = df[['tempreature', 'humidity', 'fan_actuator_on']].dropna()
    df['fan_actuator_on'] = df['fan_actuator_on'].astype(int)
    print(f"Dữ liệu còn lại sau dropna: {df.shape[0]} dòng")
    return df

def train_model(df: pd.DataFrame):
    X = df[['tempreature', 'humidity']]
    y = df['fan_actuator_on']
    column_order = X.columns.tolist()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    print("Đánh giá mô hình trên tập test:")
    y_pred = model.predict(X_test_scaled)
    print(classification_report(y_test, y_pred))

    train_acc = accuracy_score(y_train, model.predict(X_train_scaled))
    print(f"Accuracy trên tập train: {train_acc:.2f}")

    scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print("Cross-validation accuracy (mean):", scores.mean())
    print("Cross-validation scores:", scores)

    return model, scaler, column_order, X_train

def save_model(model, scaler, column_order):    
    joblib.dump(model, "models/model_rf.pkl")
    joblib.dump(scaler, "models/scaler.pkl")
    joblib.dump(column_order, "models/column_order.pkl")


df = load_and_preprocess_data("data/IoTProcessed_Data.csv")
model, scaler, column_order, X_train = train_model(df)
save_model(model, scaler, column_order)


