# Project Setup

## Backend Setup

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Configure the environment variables:
    - Create a [.env](http://_vscodecontentref_/0) file in the [backend](http://_vscodecontentref_/1) directory with the following content:
        ```
        # Port to run the server on
        PORT = <yours>

        # Database configuration
        DATABASE_SERVER = <yours>
        DATABASE_NAME = <yours>
        DATABASE_USER = <yours>
        DATABASE_PASSWORD = <yours>

        # Secret key for encrypting password
        SECRET_KEY = <yours>
        ```

4. Start the backend server:
    ```sh
    npm start
    ```



## Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Configure the environment variables:
    - Create a [.env](http://_vscodecontentref_/2) file in the [frontend](http://_vscodecontentref_/3) directory with the following content:
        ```
        REACT_APP_API_URL=<yours>
        ```

4. Add fallbacks in `node_modules/react-scripts/config/webpack.config.js` to use the [.env](http://_vscodecontentref_/4) file:
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
