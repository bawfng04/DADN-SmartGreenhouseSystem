import React, { useState } from "react";
import "./Register.css";
import Logo from "../../../../assets/Logo.png";

import { registerAPI } from "../../../../apis";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegisterClick = async (e) => {
    console.log("API:", registerAPI);
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(registerAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(username, password);
  };

  return (
    <div className="register-container">
      <div className="register-container-content">
        <div className="register-title-container">
          <img
            src={Logo}
            alt="Logo"
            className="register-logo"
            onClick={handleLogoClick}
          />
          <h1 className="register-title">Register</h1>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-form-label">Username</label>
          <input
            className="register-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="register-form-label">Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="register-form-label">Confirm Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="register-links-container">
            <a href="/home" className="register-login-link">
              Back to homepage
            </a>
            <a href="/login" className="register-login-link">
              Login
            </a>
          </div>

          <button
            type="submit"
            className="register-button"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
