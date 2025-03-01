import { useState, useEffect } from "react";
import { exampleAPI } from "../../../apis";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Notification from "../../common/Notification/Notification";


// lấy data từ adafruit của BE

const adafruitAPI = process.env.REACT_APP_API_URL + "/adafruit-thermal-data";


const ExampleComponent = () => {
  const [data, setData] = useState([]);
  const [adafruitData, setAdafruitData] = useState([]);
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





  useEffect(() => {
    FetchExample();
    FetchAdafruit();
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
      <div className="adafruit-component-content">
        {adafruitData ? (
          <pre>{JSON.stringify(adafruitData)}</pre>
        ) : (
          <p>Loading Adafruit data...</p>
        )}
      </div>
    </div>
  );
};

export default ExampleComponent;
