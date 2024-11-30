import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import Location from "../../components/Location/Location";
import LocationMobile from "../../components/Location/LocationMobile";
import Card from "../../components/Card/Card";
import bgImage from "../../images/homepage-background.png"

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/posts/posts`
        );
        console.log("response.data", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="bgPicContainer">
  <img 
    src={bgImage} 
    alt="Background" 
    className="bgImage" 
  />
  <Navbar />
  <Hero />
</div>

      {isMobile ? <LocationMobile /> : <Location />}

      <div className="cardContainer" data-aos="fade-up" data-aos-duration="500">
        <div className="featuredHead">
          <h1>Featured Hostels</h1>
        </div>
        <div className="featuredContent">
          {posts.slice(0, 5).map((post) => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </div>

      <div className="cardContainer" data-aos="fade-up" data-aos-duration="500">
        <div className="featuredHead">
          <h1>Top Rated Hostels</h1>
        </div>
        <div className="featuredContent">
          {posts.slice(0, 10).map((post) => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
