import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '../components/Footer/Footer';

const PersonalInfo = () => {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <Navbar />
      <div className="font-Poppins">
        <div className="relative  w-full p-6 lg:p-12 flex flex-col lg:flex-row">
          
          {/* Back Arrow at the Top Left */}
          <button 
            className="absolute top-6 left-6 text-indigo-500 hover:text-indigo-700 flex items-center"
            onClick={() => navigate('/profile')}
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>

          {/* Right Form Section */}
          <div className="w-full lg:w-3/4 mx-auto">
            {/* Avatar and User Info */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mb-6">
              <img
                src={userInfo?.profilePicture || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="rounded-full border-4 border-indigo-500 w-32 h-32 object-cover mb-4 lg:mb-0"
              />
              <div className="ml-0 lg:ml-6 text-center lg:text-left">
                <h1 className="text-2xl font-bold">{`${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`}</h1>
                <p className="text-gray-500">{userInfo?.email}</p>
                <p className="text-gray-500">{userInfo?.phone}</p>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  value={userInfo?.firstName}
                  disabled
                  className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={userInfo?.lastName}
                  disabled
                  className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="email"
                  value={userInfo?.email}
                  disabled
                  className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={userInfo?.phone}
                  disabled
                  className="w-full max-w-sm lg:max-w-none border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default PersonalInfo;
