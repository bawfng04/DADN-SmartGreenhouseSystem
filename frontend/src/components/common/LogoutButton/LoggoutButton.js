import React from "react";
import "./LoggoutButton.css";

const LoggoutButton = () => {
  const handleLogout = () => {
    alert("Logout successful");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LoggoutButton;
