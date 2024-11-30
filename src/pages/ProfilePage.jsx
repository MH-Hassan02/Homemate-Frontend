import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FiSettings,
  FiUser,
  FiCreditCard,
  FiHeart,
  FiFileText,
  FiEdit,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../redux/slices/userSlice";

const ProfilePage = () => {
  const [avatar, setAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const [oldAvatar, setOldAvatar] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo?.profilePicture) {
      setAvatar(userInfo.profilePicture);
      setOldAvatar(userInfo.profilePicture);
    } else {
      setAvatar(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      );
    }
  }, [userInfo]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };

        // Call the delete API for the old avatar if it exists
        if (oldAvatar) {
          await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/upload/profilePicture`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: { userId: userInfo._id },
            }
          );
        }

        // Now upload the new profile picture
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/upload/profilePicture`,
          formData,
          config
        );

        setAvatar(data.imageUrl);
        setPreview(null);
        alert("Profile picture updated successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image", error);
        alert("Failed to upload profile picture");
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleLogout = () => {
      dispatch(logout());
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-4xl mt-8 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Profile</h1>
            <button className="relative">
              <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full" />
              <FiSettings className="text-gray-500 text-2xl" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={preview || avatar}
                alt="User Avatar"
                className="rounded-full border-4 border-indigo-500 w-20 h-20 object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">
                  {userInfo?.firstName} {userInfo?.lastName}
                </h2>
                <p className="text-gray-500">{userInfo?.email}</p>
                <label
                  htmlFor="uploadAvatar"
                  className="block mt-2 text-primary cursor-pointer"
                >
                  Change profile picture
                </label>
                <input
                  type="file"
                  id="uploadAvatar"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {preview && (
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={handleUpload}
                      className="px-4 py-2 bg-primary text-white font-semibold rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Options Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/personal"
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <FiUser className="text-2xl text-primary" />
                  <span className="text-lg font-semibold">Personal Info</span>
                </div>
                <FiSettings className="text-gray-400" />
              </Link>

              <Link
                to="/editprofile"
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <FiEdit className="text-2xl text-primary" />
                  <span className="text-lg font-semibold">Edit Info</span>
                </div>
                <FiSettings className="text-gray-400" />
              </Link>

              <Link
                to="/myposts"
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <FiFileText className="text-2xl text-primary" />
                  <span className="text-lg font-semibold">My Posts</span>
                </div>
                <FiSettings className="text-gray-400" />
              </Link>

              <Link
                to="/favorites"
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <FiHeart className="text-2xl text-primary" />
                  <span className="text-lg font-semibold">Favourite</span>
                </div>
                <FiSettings className="text-gray-400" />
              </Link>

              <Link
               onClick={handleLogout}
                className="flex items-center justify-between bg-red-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition md:hidden" // `md:hidden` hides on larger screens
              >
                <div className="flex items-center space-x-4">
                  <FiLogOut className="text-2xl" />
                  <span className="text-lg font-semibold">Logout</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
