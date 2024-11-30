import React from "react";
import leaf1 from "../../images/leaf1.avif";
import leaf2 from "../../images/leaf2.avif";
import {
  FaBroom,
  FaClipboardCheck,
  FaKey,
  FaComments,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import "./Rating.css";

const Rating = () => {
  return (
    <div className="rating-container">
      <div className="rating-value">
        <img src={leaf1} alt="Leaf" className="leaf" />
        <span>4.95</span>
        <img src={leaf2} alt="Leaf" className="leaf" />
      </div>

      <div className="rating-text">Guest favorite</div>

      <div className="rating-description">
        This home is in the top 10% of eligible listings based on ratings,
        reviews, and reliability
      </div>

      <div className="rating-details">
        <section>
          <div className="rating-detail-bar">
            <span className="rating-title">Overall rating</span>
            <div className="rating-bar">
              <span
                className="rating-bar-fill"
                style={{ width: "100%" }}
              ></span>
            </div>
            <div className="rating-bar">
              <span className="rating-bar-fill" style={{ width: "50%" }}></span>
            </div>
            <div className="rating-bar">
              <span
                className="rating-bar-fill"
                style={{ width: "20px" }}
              ></span>
            </div>
          </div>
        </section>

        <div className="rating-main">
          <div className="rating-detail">
            <FaBroom className="icon" />
            <span>Cleanliness</span>
            <span className="rating-score">5.0</span>
          </div>

          <div className="rating-detail">
            <FaClipboardCheck className="icon" />
            <span>Accuracy</span>
            <span className="rating-score">5.0</span>
          </div>

          <div className="rating-detail">
            <FaKey className="icon" />
            <span>Check-in</span>
            <span className="rating-score">5.0</span>
          </div>

          <div className="rating-detail">
            <FaComments className="icon" />
            <span>Communication</span>
            <span className="rating-score">5.0</span>
          </div>

          <div className="rating-detail">
            <FaMapMarkerAlt className="icon" />
            <span>Location</span>
            <span className="rating-score">5.0</span>
          </div>

          <div className="rating-detail">
            <FaTag className="icon" />
            <span>Value</span>
            <span className="rating-score">4.9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
