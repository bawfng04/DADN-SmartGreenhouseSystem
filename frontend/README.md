# Multidisciplinary Project Frontend

This is the frontend application for the Multidisciplinary Project, built with Expo and React Native.

## Features

- Cross-platform support (iOS, Android, Web)
- Modern UI with React Native Paper components
- Real-time data visualization with charts
- Calendar integration
- Gesture-based interactions
- TypeScript support for type safety

## Tech Stack

- **Framework**: Expo 52.0.40
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: Expo Router
- **State Management**: React Query
- **Charts**: React Native Chart Kit & Gifted Charts
- **Testing**: Jest

## Project Structure

```
frontend/
├── app/              # Main application routes and screens
├── components/       # Reusable UI components
├── constants/        # Application constants
├── data/            # Data models and types
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── assets/          # Static assets (images, fonts)
└── @types/          # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Choose your development platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

## Development

- The app uses file-based routing with Expo Router
- Main application code is in the `app` directory
- Reusable components are in the `components` directory
- TypeScript is used throughout the project for type safety

## Building

The project is configured with EAS (Expo Application Services) for building. Configuration can be found in `eas.json`.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request
