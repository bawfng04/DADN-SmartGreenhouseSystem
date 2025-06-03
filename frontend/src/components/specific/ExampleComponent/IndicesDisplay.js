import React, { useState, useEffect } from "react";
import axios from "axios";
// Assuming you have a LoadingSpinner component
// import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";

// Assuming your API base URL is configured, e.g., in an environment variable
const API_URL = "http://localhost:8000/api";

function IndicesDisplay() {
  const [indicesData, setIndicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndicesData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token"); // Get token from storage

      if (!token) {
        setError("Authentication token not found. Please login.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/indices`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        });
        setIndicesData(response.data);
      } catch (err) {
        console.error("Error fetching indices data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch indices data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndicesData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="indices-display">
      <h2>Latest Sensor Indices</h2>
      {/* {isLoading && <LoadingSpinner />} */}
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!isLoading && !error && indicesData.length > 0 && (
        <ul>
          {indicesData.map((item) => (
            <li key={item.id}>
              <strong>{item.name}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}
      {!isLoading && !error && indicesData.length === 0 && (
        <p>No indices data available.</p>
      )}
    </div>
  );
}

export default IndicesDisplay;
