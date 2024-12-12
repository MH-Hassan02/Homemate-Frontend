import React from "react";
import { useNavigate } from "react-router-dom";
import "./Location.css";

const Location = () => {
  const navigate = useNavigate();

  const handleLocationClick = (area) => {
    navigate(`/search?area=${area}`);
  };

  return (
    <div className="locationMain" data-aos="fade-up" data-aos-duration="500">
      <h1>Popular Locations</h1>
      <div className="locationFull">
        <div
          className="location1"
          onClick={() => handleLocationClick("gulshan")}
        >
          <img src="https://picsum.photos/200/200" alt="gulshan" />
          <label>Gulshan</label>
        </div>
        <div className="location2-3">
          <div
            className="location2"
            onClick={() => handleLocationClick("malir")}
          >
            <img src="https://picsum.photos/200/160" alt="malir" />
            <label>Malir</label>
          </div>
          <div
            className="location3"
            onClick={() => handleLocationClick("bahadurabad")}
          >
            <img src="https://picsum.photos/160/120" alt="bahadurabad" />
            <label>Bahadurabad</label>
          </div>
        </div>
        <div className="location4" onClick={() => handleLocationClick("jauhar")}>
          <img src="https://picsum.photos/200/250" alt="jauhar" />
          <label>Jauhar</label>
        </div>
        <div className="location5-6">
          <div
            className="location5"
            onClick={() => handleLocationClick("maymar")}
          >
            <img src="https://picsum.photos/200/120" alt="maymar" />
            <label>Maymar</label>
          </div>

          <div
            className="location6"
            onClick={() => handleLocationClick("saddar")}
          >
            <img src="https://picsum.photos/200/220" alt="saddar" />
            <label>Saddar</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
