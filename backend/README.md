## Description
Backend server using Node.js and Express.js, with PostgreSQL as the database.

Hosted on Render and Vercel for deployment.

## Project Setup

### Backend Setup
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Configure the environment variables:
    - Create a `.env` file in the `backend` directory with the following content:
        ```
        # Port to run the server on
        PORT = <yours>

        # SSMS Database configuration
        DATABASE_SERVER = <yours>
        DATABASE_NAME = <yours>
        DATABASE_USER = <yours>
        DATABASE_PASSWORD = <yours>

        # POSTGRESQL Database configuration
        POSTGRES_HOST= <yours>
        POSTGRES_PORT= <yours>
        POSTGRES_DB= <yours>
        POSTGRES_USER= <yours>
        POSTGRES_PASSWORD= <yours>
        POSTGRES_EXTERNAL_URL= <yours>

        # Secret key for encrypting password
        SECRET_KEY = <yours>

        # JWT Authentication
        JWT_SECRET_KEY = <your_secure_secret_key>

        # Adafruit IO configuration
        ADAFRUIT_IO_USERNAME = <yours>
        ADAFRUIT_IO_KEY = <yours>

        # Frontend URL
        FRONTEND_URL = <yours>
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
        REACT_APP_API_URL=<yours>
        ```
4. Add fallbacks in `node_modules/react-scripts/config/webpack.config.js` to use the `.env` file:
    ```js
    {
      resolve: {
        // ...existing resolve config...
        fallback: {
          "path": require.resolve("path-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "crypto": require.resolve("crypto-browserify")
        },
        // ...rest of resolve config...
      }
    }
    ```
5. Start the frontend application:
    ```sh
    npm start
    ```
