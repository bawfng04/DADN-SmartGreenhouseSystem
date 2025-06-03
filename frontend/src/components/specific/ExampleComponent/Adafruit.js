import React from "react";
import "./ExampleComponent.css";

const AdafruitDataCard = ({ title, data }) => {
  if (data && data.loading) {
    return (
      <div className="adafruit-component-content">
        <h3>{title}</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  if (data && data.error) {
    return (
      <div className="adafruit-component-content">
        <h3>{title}</h3>
        <p className="error">Error: {data.error}</p>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="adafruit-component-content">
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  // Display the most recent data point
  const latestData = data[0];

  return (
    <div className="adafruit-component-content">
      <h3>{title}</h3>
      <div>
        <strong>Latest Value:</strong> {latestData.value}
      </div>
      <div>
        <strong>Created:</strong>{" "}
        {new Date(latestData.created_at).toLocaleString()}
      </div>
      <div className="adafruit-data-details">
        <details>
          <summary>Show all data ({data.length} items)</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default AdafruitDataCard;
