import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../redux/slices/postSlice";
import { fetchUser } from "../../redux/slices/userSlice";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Card.css";
import { FiHeart } from "react-icons/fi";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="controlBtn next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="controlBtn prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
};

const Card = ({ post }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.favorites) {
      const isFav = userInfo.favorites.includes(post._id);
      setIsFavorited(isFav);
    }
  }, [userInfo, post._id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();

    const newIsFavorited = !isFavorited;
    setIsFavorited(newIsFavorited);

    if (newIsFavorited) {
      const action = await dispatch(
        addFavorite({ postId: post._id, userId: userInfo._id })
      );
      if (addFavorite.fulfilled.match(action)) {
        dispatch(fetchUser(userInfo._id));
      }
    } else {
      const action = await dispatch(
        removeFavorite({ postId: post._id, userId: userInfo._id })
      );
      if (removeFavorite.fulfilled.match(action)) {
        dispatch(fetchUser(userInfo._id));
      }
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="card-container">
      <Link to={`/post/${post._id}`} className="card-link">
        <div className="image-slider">
          <Slider {...sliderSettings}>
            {post.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="slider-image"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="card-content">
          <h3 className="card-title">{post.title}</h3>
          <p className="card-host">{post.address}</p>
          <p className="card-status">
            {post.details[0]?.bedsAvailable > 0 ? "Available" : "Sold out"}
          </p>

          <div className="card-footer">
            <span className="view-details">View Details</span>
            {userInfo && (
              <div className="favorite-icon" onClick={handleFavoriteToggle}>
                {isFavorited ? (
                  <FaHeart color="red" />
                ) : (
                  <FiHeart color="black" />
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
