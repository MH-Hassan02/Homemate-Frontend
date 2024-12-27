import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavorites } from "../redux/slices/postSlice";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import Card from "./Card/Card.jsx";
import { useNavigate } from "react-router-dom";
import animation from "../assets/Animation Explore.gif";

const Favorites = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { favorites, loading, error } = useSelector((state) => state.posts);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchUserFavorites(userInfo._id));
    }
  }, [userInfo]);

  const errorMessage = error?.message || "An unexpected error occurred.";
  if (error)
    return (
      <div className="text-center text-red-600">
        Error fetching favorites: {errorMessage}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Your Favorites
        </h1>
        {loading ? (
          <div className="animationContainer">
            <img src={animation} alt="" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites && favorites.length > 0 ? (
              favorites.map((post) => {
                if (post._id) {
                  return (
                    <div key={post._id} className="flex justify-center">
                      <Card post={post} />
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div className="col-span-full text-center text-xl text-gray-600">
                No favorites found.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Favorites;
