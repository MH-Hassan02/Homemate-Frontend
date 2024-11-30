import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";

const EditProfilePage = () => {
  const [avatar, setAvatar] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarDelete, setAvatarDelete] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // State for password update checkbox

  const token = localStorage.getItem("authToken");

  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Fetch user data from the backend or Redux store
  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhone(userInfo.phone || "");
      setAvatar(userInfo.profilePicture || avatar);
    }
  }, [userInfo]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdatingPassword && newPassword.length < 8) {
      alert("New password must be at least 8 characters long!");
      return;
    }

    if (isUpdatingPassword && newPassword !== confirmPassword) {
      alert("New password and confirm password must match!");
      return;
    }

    if (isUpdatingPassword && currentPassword === newPassword) {
      alert("New password cannot be the same as the current password!");
      return;
    }

    // If password update is enabled, call the change password API
    if (isUpdatingPassword) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/change-password`,
          {
            email: userInfo.email,
            oldPassword: currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password. Please try again.");
      }
    }

    try {
      let updatedProfilePicture = avatar;
      // If the avatar was deleted, run the delete avatar API
      if (avatarDelete) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/upload/profilePicture`,
          {
            data: { userId: userInfo._id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // If a new avatar is selected, upload it to Cloudinary
      if (avatarFile) {
        const formData = new FormData();
        formData.append("profilePicture", avatarFile);

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/upload/profilePicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updatedProfilePicture = uploadResponse.data.imageUrl; // Get the new image URL
      }

      // Update user profile data
      const updatedData = {
        firstName,
        lastName,
        phone,
        profilePicture: updatedProfilePicture,
      };

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/auth/profile/${userInfo._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  // Handle avatar file selection
  const handleUpload = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file); // Store the file for uploading
    setAvatar(URL.createObjectURL(file)); // Set preview image
  };

  // Handle avatar deletion
  const handleDeleteAvatar = async (url) => {
    setAvatar(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
    setAvatarFile(null);
    setAvatarDelete(url);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex font-Poppins">
        <div className="bg-white shadow-lg w-full p-6 flex flex-col lg:flex-row">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 mb-4 lg:mb-0 lg:mr-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-4">
              <ul>
                <li className="mb-4">
                  <Link
                    className={`${
                      location.pathname === "/profile"
                        ? "text-primary"
                        : "text-secondary"
                    } font-semibold`}
                    to="/profile"
                  >
                    Profile Settings
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className={`${
                      location.pathname === "/favorites"
                        ? "text-primary"
                        : "text-secondary"
                    } font-semibold`}
                    to="/favorites"
                  >
                    Favorites
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className={`${
                      location.pathname === "/myposts"
                        ? "text-primary"
                        : "text-secondary"
                    } font-semibold`}
                    to="/myposts"
                  >
                    My Posts
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${
                      location.pathname === "/editprofile"
                        ? "text-primary"
                        : "text-secondary"
                    } font-semibold`}
                    to="/editprofile"
                  >
                    Edit Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-3/4">
            <form onSubmit={handleSubmit}>
              {/* Avatar and Upload/Delete */}
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mb-6">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="rounded-full border-4 border-indigo-500 w-32 h-32 object-cover mb-4 lg:mb-0"
                />
                <div className="ml-0 lg:ml-6">
                  <input
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    id="uploadAvatar"
                  />
                  <label
                    htmlFor="uploadAvatar"
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-md cursor-pointer"
                  >
                    Upload New
                  </label>
                  <button
                    onClick={() => handleDeleteAvatar(userInfo?.profilePicture)}
                    type="button"
                    className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md"
                  >
                    Delete Avatar
                  </button>
                </div>
              </div>

              {/* Display User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Password Update Checkbox */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isUpdatingPassword}
                    onChange={(e) => setIsUpdatingPassword(e.target.checked)}
                    className="mr-2"
                  />
                  Update Password
                </label>
              </div>

              {/* Password Fields */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={!isUpdatingPassword}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="Current Password"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isUpdatingPassword}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="New Password"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isUpdatingPassword}
                    className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                    placeholder="Confirm New Password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
