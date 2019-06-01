import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import wretch from "wretch";

const Home = () => {
  const [data, setData] = useState({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      await wretch("/api")
        .get()
        .json(json => {
          setData(json);
        })
        .catch(error => console.log(error));
    };
    fetchData();
  }, []);

  return <>{JSON.stringify(data)} </>;
};

ReactDOM.render(<Home />, document.getElementById("root"));
