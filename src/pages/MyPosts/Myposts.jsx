import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import { FaEdit } from 'react-icons/fa'; 
import { Link, useNavigate } from "react-router-dom";

const MyPosts = () => {
  const { userInfo } = useSelector((state) => state.user);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);


  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!userInfo?._id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/posts/user?userId=${userInfo._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [userInfo]);

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  if (error)
    return (
      <div className="text-center text-red-600">
        Error fetching posts: {error}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Your Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              if (post._id) {
                return (
                  <div key={post._id} className="flex justify-center relative">
                    <Card post={post} />
                    <Link to={`/editpost/${post._id}`}>
                    <button
                      className="absolute top-2 right-2 p-2 bg-black text-white rounded-full"
                      >
                      <FaEdit size={20} />
                    </button>
                        </Link>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="col-span-full text-center text-xl text-gray-600">
              No posts found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyPosts;
