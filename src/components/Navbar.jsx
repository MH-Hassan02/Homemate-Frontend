import React, { useEffect, useState } from "react";
import PurpleL from "../assets/PurpleL.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { FiHome, FiCompass, FiUser, FiPlus } from "react-icons/fi";
import "./sideBarBg.css";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { userInfo } = useSelector((state) => state.user);

  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    if (userInfo && userInfo.profilePicture) {
      setImageUrl(userInfo.profilePicture);
    } else {
      setImageUrl(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      );
    }
  }, [userInfo]);

  return (
    <nav
      className={`p-4 flex justify-between items-center font-Poppins ${
        !isHomePage ? "border-b border-bg-primary border-opacity-10" : ""
      }`}
    >
      <div className="logo">
        <Link to="/">
          <img src={PurpleL} alt="Logo" className="h-8 sm:h-10 w-auto" />
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link to="/explore" className="text-gray-700 font-semibold">
          Explore
        </Link>
        <Link to="/toppicks" className="text-gray-700 font-semibold">
          Top Picks
        </Link>
        <Link to="/createpost" className="text-gray-700 font-semibold">
          Create Post
        </Link>

        {userInfo ? (
          <div className="relative flex items-center space-x-2">
            <img
              src={
                userInfo.profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="User Avatar"
              className="h-10 w-10 rounded-full cursor-pointer object-cover"
              onClick={toggleDropdown}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-10 top-full">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  to="/favorites"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Favourites
                </Link>
                {/* <Link
                  to="/createpost"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Create add
                </Link> */}
                <Link
                  to="/myposts"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Posts
                </Link>
                <Link
                  to="/editprofile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-primary p-2 text-white py-1 px-4 rounded hover:bg-primaryHover transition-all">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Bottom navigation for mobile screens */}
      <div className="fixed bottom-0 left-0 w-full bg-white md:hidden shadow-lg border-t border-gray-200 flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center text-gray-700">
          <FiHome size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/explore"
          className="flex flex-col items-center text-gray-700"
        >
          <FiCompass size={24} />
          <span className="text-xs">Explore</span>
        </Link>
        <Link
          to="/createpost"
          className="flex flex-col items-center text-gray-700"
        >
          <FiPlus size={24} />
          <span className="text-xs">Create Post</span>
        </Link>
        {userInfo ? (
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-700"
          >
            <FiUser size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center text-gray-700"
          >
            <FiUser size={24} />
            <span className="text-xs">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
