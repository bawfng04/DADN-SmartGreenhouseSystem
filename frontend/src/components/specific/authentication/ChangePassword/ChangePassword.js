import React, { useState } from "react";
import "./ChangePassword.css";
import Logo from "../../../../assets/Logo.png";
import { changePasswordAPI } from "../../../../apis";


const ChangePassword = () => {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const token = localStorage.getItem("token");

  const handleChangePasswordClick = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const response = await fetch(changePasswordAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password: currentPassword,
          newpassword: newPassword,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="change-password-container">
      <div className="change-password-container-content">
        <div className="change-password-title-container">
          <img
            src={Logo}
            alt="Logo"
            className="change-password-logo"
            onClick={handleLogoClick}
          />
          <h1 className="change-password-title">Change Password</h1>
        </div>

        <form
          className="change-password-form"
          onSubmit={handleChangePasswordClick}
        >
          <label className="change-password-form-label">Username</label>
          <input
            className="change-password-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="change-password-form-label">Current Password</label>
          <input
            className="change-password-input"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label className="change-password-form-label">New Password</label>
          <input
            className="change-password-input"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="change-password-form-label">
            Confirm New Password
          </label>
          <input
            className="change-password-input"
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <div className="change-password-links-container">
            <a href="/home" className="change-password-back-link">
              Back to homepage
            </a>
          </div>

          <button type="submit" className="change-password-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
