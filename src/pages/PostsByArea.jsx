import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchPostsByArea } from "../redux/slices/postSlice";
import Card from "../components/Card/Card";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar";

const PostsByArea = () => {
  const [searchParams] = useSearchParams();
  const area =
    searchParams.get("area").charAt(0).toUpperCase() +
    searchParams.get("area").slice(1);

  const dispatch = useDispatch();
  const postsByArea = useSelector((state) => state.posts.postsByArea);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (area) {
      dispatch(fetchPostsByArea(area));
    }
  }, [area, dispatch]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Posts in {area.charAt(0).toUpperCase() + area.slice(1).toLowerCase()}
        </h1>

        {loading && (
          <p className="text-lg text-gray-500 text-center">Loading...</p>
        )}
        {error && <p className="text-lg text-red-500 text-center">{error}</p>}
        {!loading && postsByArea.length === 0 && (
          <p className="text-lg text-gray-500 text-center">
            No posts available for this location.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {postsByArea.map((post) => (
            <div key={post._id} className="flex justify-center">
              <Card post={post} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostsByArea;
