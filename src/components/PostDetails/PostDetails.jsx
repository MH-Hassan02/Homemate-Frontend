import React from "react";
import "./PostDetails.css";
import Slider from "react-slick";
import {
  FaBed,
  FaChevronLeft,
  FaChevronRight,
  FaFireExtinguisher,
  FaLightbulb,
  FaMoneyBillWave,
  FaParking,
  FaShieldAlt,
  FaSnowflake,
  FaSwimmer,
  FaTemperatureHigh,
  FaTint,
  FaTree,
  FaUsers,
  FaWifi,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdCameraAlt } from "react-icons/md";
import Rating from "../Rating/Rating";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="controlBtnPost next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="controlBtnPost prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
};

const PostDetails = ({ post, isMobile }) => {
  if (!post) {
    return <div>Loading...</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const images = post.images || [
    "https://via.placeholder.com/600",
  ];

  const details = post.details?.[0] || {};

  return (
    <>
      <div className={`detailsMain ${isMobile ? "detailsMainWide" : ""}`}>
        <div className="postSlider">
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="postSliderImg"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="postContent">
          <div className="descSection">
            <h1>{post.title}</h1>
            <p>
              <span className="detailsIconLocation">
                <FiMapPin />
              </span>
              {post.address}
            </p>
            <h2>About This Place</h2>
            <p>{post.description}</p>
          </div>
          <div className="detailsSection">
            <h3>Details</h3>
            <ul>
              <li>
                <span className="detailsIcon">
                  <FaUsers />
                </span>
                <label htmlFor="">Persons: {details.peopleLiving}</label>
              </li>
              <li>
                <span className="detailsIcon">
                  <FaBed />
                </span>
                <label htmlFor="">Beds: {details.bedsAvailable}</label>
              </li>
              <li>
                <span className="detailsIcon">
                  <FaShieldAlt />
                </span>
                <label htmlFor="">Deposit Amount: {post.deposit}</label>
              </li>
              <li>
                <span className="detailsIcon">
                  <FaMoneyBillWave />
                </span>
                <label htmlFor="">Rent Amount: {post.price}</label>
              </li>
            </ul>
          </div>
          <div className="amenitiesSection">
            <div>
              <h3>Amenities</h3>
            </div>
            <ul>
              {post.amenities?.map((amenity, index) => (
                <li key={index}>
                  {amenity === "Wi-Fi" && (
                    <span className="detailsIcon">
                      <FaWifi />
                    </span>
                  )}
                  {amenity === "Parking" && (
                    <span className="detailsIcon">
                      <FaParking />
                    </span>
                  )}
                  {amenity === "Swimming Pool" && (
                    <span className="detailsIcon">
                      <FaSwimmer />
                    </span>
                  )}
                  {amenity === "Garden" && (
                    <span className="detailsIcon">
                      <FaTree />
                    </span>
                  )}
                  {amenity === "Fire Extinguisher" && (
                    <span className="detailsIcon">
                      <FaFireExtinguisher />
                    </span>
                  )}
                  {amenity === "Water Supply" && (
                    <span className="detailsIcon">
                      <FaTint />
                    </span>
                  )}
                  {amenity === "Electricity" && (
                    <span className="detailsIcon">
                      <FaLightbulb />
                    </span>
                  )}
                  {amenity === "Security" && (
                    <span className="detailsIcon">
                      <FaShieldAlt />
                    </span>
                  )}
                  {amenity === "Heating" && (
                    <span className="detailsIcon">
                      <FaTemperatureHigh />
                    </span>
                  )}
                  {amenity === "Air Conditioning" && (
                    <span className="detailsIcon">
                      <FaSnowflake />
                    </span>
                  )}
                  {amenity === "CCTV" && (
                    <span className="detailsIcon">
                      <MdCameraAlt />
                    </span>
                  )}
                  <label htmlFor="">{amenity}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="locationSection">
            <h3>Location Map</h3>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${
                import.meta.env.VITE_MAP_KEY
              }&q=${post.location.latitude},${post.location.longitude}&zoom=15`}
              width="100%"
              height="500"
              allowFullScreen=""
              loading="lazy"
              title="location map"
            ></iframe>
          </div>
        </div>
        <Rating post={post}/>
      </div>
    </>
  );
};

export default PostDetails;
