import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/userSlice";
import logo from "../../assets/PurpleL.png";
import mainImg from "../../assets/snP.jpg";
import "./Signup.css"; // Import external CSS for additional styling
import { ToastContainer } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, userInfo } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <>
      <div className="signup-container">
        {/* Left Section (Form) */}
        <div className="signup-left">
          <div className="signup-form-container">
            <div className="signup-logo">
              <img src={logo} alt="Logo" />
            </div>
            <h1 className="signup-title">Create your account</h1>

            <form onSubmit={handleSubmit}>
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                className="signup-input"
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                className="signup-input"
                required
              />
              <input
                name="phone"
                type="number"
                placeholder="Phone Number"
                onChange={handleChange}
                className="signup-input"
                required
                title="Please enter a phone number."
              />
              <input
                name="email"
                placeholder="Email address"
                onChange={handleChange}
                className="signup-input"
                type="email"
                required
              />
              <input
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="signup-input"
                type="password"
                required
                minLength={6}
                title="Password must be at least 6 characters."
              />

              <p className="signup-login-text">
                Don't have an account?{" "}
                <Link
                  to="/login"
                  className="signup-login-link no-underline text-primary"
                >
                  Login
                </Link>
              </p>
              <button
                className={`signup-btn ${loading ? "signup-btn-disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section (Illustration) */}
        <div className="signup-right">
          <img src={mainImg} alt="Illustration" className="signup-main-img" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
