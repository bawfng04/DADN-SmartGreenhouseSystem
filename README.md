# 🌿 Smart Greenhouse IoT System

<div align="center">

![Smart Greenhouse](https://img.shields.io/badge/IoT-Smart%20Greenhouse-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

*An intelligent IoT greenhouse monitoring and control system with AI-powered automation*

</div>

## Table of Contents

- [🌿 Smart Greenhouse IoT System](#-smart-greenhouse-iot-system)
- [✨ Features](#-features)
  - [🔍 Real-time Monitoring](#-real-time-monitoring)
  - [🤖 Smart Automation](#-smart-automation)
  - [🎛️ Device Management](#️-device-management)
  - [🔔 Smart Alerts](#-smart-alerts)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Machine Learning](#machine-learning)
  - [DevOps & Deployment](#devops--deployment)
- [Project Setup](#project-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [📁 Project Structure](#-project-structure)


## ✨ Features

### 🔍 Real-time Monitoring
- **Environmental Sensors**: Temperature, Humidity, Soil Moisture, Light intensity
- **Live Dashboard**: Real-time data visualization with charts and graphs
- **Historical Analytics**: Track trends and patterns over time
- **WebSocket Integration**: Instant updates without page refresh

### 🤖 Smart Automation
- **AI-Powered Control**: Machine learning models for optimal device control
- **Automatic Mode**: Intelligent responses based on sensor readings
- **Scheduled Control**: Time-based automation with custom schedules
- **Manual Override**: Complete manual control when needed

### 🎛️ Device Management
- **LED Control**: Smart lighting with intensity adjustment (0-100%)
- **Fan Control**: Ventilation management with variable speed (0-100%)
- **Water Pump**: Automated irrigation system with flow control (0-100%)

### 🔔 Smart Alerts
- **Threshold Monitoring**: Custom alerts for sensor values
- **Reminder System**: Scheduled notifications and maintenance reminders
- **Alert History**: Track all notifications and system events


## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Real-time**: WebSocket (ws library)
- **IoT Platform**: Adafruit IO with MQTT
- **Authentication**: JWT tokens
- **Environment**: dotenv configuration

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: Expo Router
- **State Management**: React Query
- **Charts**: React Native Chart Kit & Gifted Charts

### Machine Learning
- **Language**: Python 3.x
- **Framework**: Scikit-learn
- **Algorithm**: Random Forest Classifier
- **Features**: Environmental sensor data processing
- **Devices**: LED, Fan, Water Pump control prediction

### DevOps & Deployment
- **Deployment**: Render.com (Backend), Expo (Frontend)
- **Version Control**: Git
- **Package Management**: npm (Node.js), pip (Python)
## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bawfng04/DADN-SmartGreenhouseSystem.git
cd DADN-SmartGreenhouseSystem
```

### 2. Database Setup

1. **Install PostgreSQL** and create a database.

2. **Import database schema:**
   - Navigate to `backend/src/database/create.sql`
   - Copy the SQL content and execute it in your PostgreSQL database
   - Or run: `psql -U postgres -d <database name> -f backend/src/database/create.sql`

### 3. Backend Setup

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
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=<yours>
   POSTGRES_USER=<yours>
   POSTGRES_PASSWORD=<yours>

   # Postgres connection - For hosted database (comment out when running locally)
   # POSTGRES_HOST=<yours>
   # POSTGRES_PORT=<yours>
   # POSTGRES_DB=<yours>
   # POSTGRES_USER=<yours>
   # POSTGRES_PASSWORD=<yours>
   # DB_SSLMODE=require
   # POSTGRES_EXTERNAL_URL=<yours>?ssl=tr

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
   npm run dev
   ```

For complete API documentation, see [backend/README.md](backend/README.md).

### 4. Frontend Setup

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

## 📁 Project Structure

```
DADN-SmartGreenhouseSystem/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── models/            # Database models
│   │   ├── services/          # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── routes/            # Route definitions
│   │   ├── utils/             # Utilities (MQTT, etc.)
│   │   ├── database/          # Database configuration
│   │   └── GreenhouseModel/   # AI prediction models
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # React Native Frontend
│   ├── app/                   # App screens (Expo Router)
│   ├── components/            # Reusable components
│   ├── constants/             # App constants
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── assets/                # Static assets
│   ├── .env                   # Environment variables
│   └── package.json
│
├── Machine learning model/     # Python ML Models
│   ├── fan_control/           # Fan control model
│   ├── led_control/           # LED control model
│   ├── pump_control/          # Pump control model
│   └── README.md
│
└── README.md                  # This file
```