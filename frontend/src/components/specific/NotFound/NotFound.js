import React from "react";
import "./NotFound.css";
import BackToHomepageButton from "../../common/BackToHomeButton/BackToHomeButton";
import LoggoutButton from "../../common/LogoutButton/LoggoutButton";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Page Not Found</p>
      <p className="not-found-description">
        The page you are looking for does not exist. Check the URL and try
        again.
      </p>
      <BackToHomepageButton />
      <LoggoutButton />
    </div>
  );
};

export default NotFound;
