import React from "react";
import "./BackToHomeButton.css";

const BackToHomeButton = () => {
  const handleBackToHomepage = () => {
    window.location.href = "/";
  };

  return (
    <button onClick={handleBackToHomepage} className="back-to-home-button">
      Back to homepage
    </button>
  );
};

export default BackToHomeButton;
