import React from "react";
import { FiSearch } from "react-icons/fi";
import "./Hero.css"; // Import the CSS file

const Hero = () => {
  return (
    <div className="heroMain">
      <h1>
        FIND YOUR <span>ACCOMMODATION</span> WITH EASE
      </h1>
      <div className="heroSearch">
        <input type="text" placeholder="Search now!" />
        <div className="heroSearchicon">
          <FiSearch />
        </div>
      </div>
    </div>
  );
};

export default Hero;
