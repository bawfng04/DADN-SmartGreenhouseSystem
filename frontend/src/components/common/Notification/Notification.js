import React, { useState } from "react";
import "./Notification.css";

const Notification = ({ message }) => {
  const [isDisplayed, setIsDisplayed] = useState(true);

  return (
    isDisplayed && (
      <div className="notification-container">
        <div className="notification-message">{message}</div>
        <button
          className="notification-close-button"
          onClick={() => setIsDisplayed(false)}
        >
          X
        </button>
      </div>
    )
  );
};

export default Notification;
