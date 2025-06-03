import React from "react";
import "./Unauthorized.css";
import BackToHomeButton from "../../common/BackToHomeButton/BackToHomeButton";
import LoggoutButton from "../../common/LogoutButton/LoggoutButton";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">401</h1>
      <p className="unauthorized-message">Unauthorized</p>
      <p className="unauthorized-description">
        You are not authorized to view this page.
      </p>
      <BackToHomeButton />
      <LoggoutButton />
    </div>
  );
};

export default Unauthorized;
