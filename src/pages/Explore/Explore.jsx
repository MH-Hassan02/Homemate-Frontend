import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner from "../../images/ExploreBanner.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import "./Explore.css";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/posts`);
        const shuffledPosts = shuffleArray(response.data);
        setPosts(shuffledPosts);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mainContainer">
        <div className="topContainer">
          <div className="topHead">
            <h1>Find your perfect space today!</h1>
          </div>
          <div className="topImg">
            <img src={Banner} alt="Banner" />
          </div>
        </div>
        <div className="cardsContainer">
          {loading ? (
            <div className="text-center">Loading posts...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id} post={post} /> 
            ))
          ) : (
            <div className="text-center text-gray-500">No posts available.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Explore;
