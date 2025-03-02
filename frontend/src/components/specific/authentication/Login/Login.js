import React, { useState, useEffect } from "react";
import "./Login.css";
import Logo from "../../../../assets/Logo.png";
import { loginAPI } from "../../../../apis";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleLoginClick = async (e) => {
  console.log("loginAPI: ", loginAPI);
  console.log("Button clicked, waiting...");
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = "/home";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Login failed. Please check if the backend server is running.");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    console.log("API:" + loginAPI);
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="login-container">
      <div className="login-container-content">
        <div className="login-title-container">
          <img
            src={Logo}
            alt="Logo"
            className="login-logo"
            onClick={handleLogoClick}
          />
          <h1 className="login-title">Login</h1>
        </div>

        <form className="login-form">
          <label className="login-form-label">Username</label>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="login-form-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-links-container">
            <a href="/home" className="login-register-link">
              Back to homepage
            </a>
            <a href="/register" className="login-register-link">
              Register
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
