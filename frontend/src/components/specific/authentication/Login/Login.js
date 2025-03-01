import React, { useState } from "react";
import "./Login.css";
import Logo from "../../../../assets/Logo.png";

const loginAPI = process.env.REACT_APP_API_URL + "/login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(loginAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      alert(data.message);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };


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
