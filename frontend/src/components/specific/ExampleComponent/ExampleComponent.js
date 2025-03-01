import { useState, useEffect } from "react";
import { exampleAPI } from "../../../apis";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Notification from "../../common/Notification/Notification";

const ExampleComponent = () => {
  const [data, setData] = useState([]);
  async function FetchExample() {
    try {
      const response = await fetch(exampleAPI);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    FetchExample();
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
    </div>
  );
};

export default ExampleComponent;
