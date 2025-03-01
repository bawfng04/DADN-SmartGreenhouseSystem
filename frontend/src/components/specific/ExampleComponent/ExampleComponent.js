import { useState, useEffect } from "react";
import { exampleAPI } from "../../../apis";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Notification from "../../common/Notification/Notification";
import "./ExampleComponent.css";
// lấy data từ adafruit của BE

const adafruitAPI = process.env.REACT_APP_API_URL + "/adafruit-thermal-data";
const adafruitAPI2 = process.env.REACT_APP_API_URL + "/adafruit-lightfan-data";

const ExampleComponent = () => {
  const [data, setData] = useState([]);
  const [adafruitData, setAdafruitData] = useState([]);
  const [adafruitData2, setAdafruitData2] = useState([]);
  async function FetchExample() {
    try {
      const response = await fetch(exampleAPI);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function FetchAdafruit() {
    try {
      const response = await fetch(adafruitAPI);
      const data = await response.json();
      setAdafruitData(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function FetchAdafruit2() {
    try {
      const response = await fetch(adafruitAPI2);
      const data = await response.json();
      setAdafruitData2(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    FetchExample();
    FetchAdafruit();
    FetchAdafruit2();
  }, []);

  return (
    <div className="example-component">
      <div className="example-component-content">
        <Notification
          message="This is an example notification
        message: ExampleComponent is rendered!

        "
        />
        <h1>Example Component</h1>
        <p>API URL: {exampleAPI}</p>
        <ul>
          {data.map((item, index) => (
            <div key={index}>
              <p>-----</p>
              <li>{item.ID}</li>
              <li>{item.NAME}</li>
              <li>{item.AGE}</li>
            </div>
          ))}
        </ul>
        <LoadingSpinner />
      </div>
      <div className="adafruit-component">
        <h2>Adafruit Data</h2>
        <div className="adafruit-component-content">
          <h3>Temperature & Humidity Data</h3>
          {adafruitData ? (
            <pre>{JSON.stringify(adafruitData, null, 2)}</pre>
          ) : (
            <p>Loading Adafruit data...</p>
          )}
        </div>
        <div className="adafruit-separator">
          ===============================
        </div>
        <div className="adafruit-component-content">
          <h3>Light & Fan Control Data</h3>
          {adafruitData2 ? (
            <pre>{JSON.stringify(adafruitData2, null, 2)}</pre>
          ) : (
            <p>Loading Adafruit data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;