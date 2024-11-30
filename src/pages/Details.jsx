// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import PostDetails from "../components/PostDetails/PostDetails";
// import Book from "../components/Book/Book";
// import Footer from "../components/Footer/Footer";
// import Navbar from "../components/Navbar";

// const Details = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (!userInfo) {
//       navigate("/login");
//     }
//   }, [userInfo, navigate]);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/posts/post/${id}`
//         ); // Fetch individual post by id
//         console.log(response.data, "response.data");
//         setPost(response.data);
//       } catch (error) {
//         console.error("Error fetching post:", error);
//       }
//     };
//     fetchPost();
//   }, [id]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleResize = () => {
//     if(window.innerWidth < 1024){
//       setIsMobile(true)
//     } else {
//       setIsMobile(false)
//     }
//   };

//   useEffect(() => {
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <>
//       <div className="detailsPageContainer">
//         <Navbar />
//         <div className="detailsContainer">
//           {post && <PostDetails post={post} isMobile={isMobile}/>}
//           {post && <Book post={post} isMobile={isMobile}/>}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Details;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PostDetails from "../components/PostDetails/PostDetails";
import Book from "../components/Book/Book";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar";

const Details = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user); // Access userInfo from Redux state

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/posts/post/${id}`
        ); // Fetch individual post by id
        console.log(response.data, "response.data");
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="detailsPageContainer">
        <Navbar />
        <div className="detailsContainer">
          {post && <PostDetails post={post} isMobile={isMobile} />}
          {post && <Book post={post} isMobile={isMobile} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Details;
