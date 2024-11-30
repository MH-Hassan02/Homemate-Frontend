import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/userSlice";
import logo from "../../assets/PurpleL.png";
import mainImg from "../../assets/lgP.jpg";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);


 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="flex justify-between h-screen font-Poppins overflow-hidden">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="max-w-sm w-full">
          <div className="mb-6">
            {/* You need to define or import the 'logo' */}
            <img src={logo} alt="Logo" className="h-10 mb-4" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-4 ">LOGIN</h1>
          {/* Wrap the form inputs in a form tag */}
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="border-2 border-[#af8fe9] rounded-md p-3 focus:outline-none focus:border-primary w-full  mb-3"
              type="email"
              required
            />
            <input
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border-2 border-[#af8fe9]  focus:outline-none focus:border-primary w-full p-3 rounded mb-3"
              type="password"
              required
            />

            <p className="my-4 text-secondary">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-primary">Register</span>
              </Link>
            </p>
            {/* Corrected button text */}
            <button
              className="lgBtn text-white w-full py-2 rounded mb-4"
              type="submit"
            >
              Log in
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Image with content */}
      <div className="rightC hidden md:flex md:w-1/2 justify-center items-center">
        <div className="text-white text-center">
          <img src={mainImg} alt="Healthcare" className="mainImg" />

          <div className="flex justify-center space-x-2 mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
