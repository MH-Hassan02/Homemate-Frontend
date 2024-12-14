import React, { useState } from "react";
import ReactStars from "react-stars";
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
import { useSelector } from "react-redux";
import "./Rating.css";
import axios from "axios";

const Rating = ({ post }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    accuracy: 0,
    checkin: 0,
    communication: 0,
    location: 0,
    value: 0,
  });

  const handleChange = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (ratings) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/post/${post._id}/rate`,
        ratings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  return (
    <>
      <div className="rating-container">
        <div className="rating-value">
          <img src={leaf1} alt="Leaf" className="leaf" />
          <span>{(post?.rating?.main === 0 || post?.rating?.main == null) ? "N/A" : post?.rating?.main?.toFixed(2)}</span>
          <img src={leaf2} alt="Leaf" className="leaf" />
        </div>

        <div className="rating-text">Guest favorite</div>

        <div className="rating-description">
          This home is in the top 10% of eligible listings based on ratings,
          reviews, and reliability
        </div>

        <div className="rating-main">
          {[
            { label: "Cleanliness", field: "cleanliness", icon: FaBroom },
            { label: "Accuracy", field: "accuracy", icon: FaClipboardCheck },
            { label: "Check-in", field: "checkin", icon: FaKey },
            {
              label: "Communication",
              field: "communication",
              icon: FaComments,
            },
            { label: "Location", field: "location", icon: FaMapMarkerAlt },
            { label: "Value", field: "value", icon: FaTag },
          ].map(({ label, field, icon: Icon }) => (
            <div className="rating-detail" key={field}>
              <Icon className="icon" />
              <span>{label}</span>
              <span className="rating-score">
                {post?.rating?.[field] || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {userInfo?.isAdmin && (
        <div className="adminContainer">
          <button onClick={() => setShowModal(true)}>Rate this Post</button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Rate the Post</h3>
            {Object.keys(ratings).map((field) => (
              <div key={field} className="modal-rating">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <ReactStars
                  count={5}
                  size={24}
                  value={ratings[field]}
                  onChange={(value) => handleChange(field, value)}
                  half={false}
                  color2={"#ffd700"}
                />
              </div>
            ))}
            <button className="submitBtn"
              disabled={Object.values(ratings).some((value) => value === 0)}
              onClick={() => handleSubmit(ratings)}
            >
              Submit
            </button>
            <button className="closeBtn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Rating;
