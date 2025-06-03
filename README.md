# Smart Greenhouse IoT System

## Description

A complete IoT greenhouse monitoring and control system with AI-powered automation.

**Backend:** Node.js + Express.js + PostgreSQL + MQTT + WebSocket
**Frontend:** React Native + Expo
**IoT Integration:** Adafruit IO + MQTT
**AI Features:** Automatic device control based on sensor predictions
**Deployment:** Render, Vercel, Ngrok support

## Features

- 🌡️ **Real-time sensor monitoring** (Temperature, Humidity, Soil Moisture, Light)
- 🤖 **AI-powered automatic control** (LED, Fan, Water Pump)
- ⏰ **Scheduled device control** with custom timing
- 🔔 **Smart notifications & reminders** based on sensor thresholds
- 📊 **Historical data tracking** and analytics
- 🌐 **Real-time WebSocket updates**
- 📱 **Cross-platform mobile app**

## Project Setup

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install the dependencies:
   ```sh
   pip install -r requirements.txt && npm install
   ```
3. Configure the environment variables:

   - Create a `.env` file in the `backend` directory with the following content:

   ```
   # Port to run the server on
   PORT = <yours>

   # Postgres connection - For local database
   POSTGRES_HOST=<yours>
   POSTGRES_PORT=<yours>
   POSTGRES_DB=<yours>
   POSTGRES_USER=<yours>
   POSTGRES_PASSWORD=<yours>

   # Postgres connection - For hosted database
   # POSTGRES_HOST=<yours>
   # POSTGRES_PORT=<yours>
   # POSTGRES_DB=<yours>
   # POSTGRES_USER=<yours>
   # POSTGRES_PASSWORD=<yours>
   # DB_SSLMODE=require
   # POSTGRES_EXTERNAL_URL=<yours>?ssl=true

   # Secret key for encrypting password
   SECRET_KEY=<yours>

   # Secret key for token
   JWT_SECRET_KEY=<yours>

   # Adafruit IO configuration
   ADAFRUIT_IO_USERNAME=<yours>
   ADAFRUIT_IO_KEY=<yours>

   # Frontend URL
   FRONTEND_URL=<yours>

   ```

4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Configure the environment variables:
   - Create a `.env` file in the `frontend` directory with the following content:
     ```
     API_URL = <yours>
     WEBSOCKET_URL = <yours>
     ```
4. Start the frontend application:
   ```sh
   npx expo start
   ```
