import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footContainer">
          <div className="box">
            <ul className="flexli">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Blog</li>
              <li>FAQ</li>
              <li>Watch List</li>
            </ul>
            <p className="disclaimer">
            © HomeMate, {new Date().getFullYear()}. All rights reserved. This website provides listings and information related to hostels and room rentals but is not endorsed or certified by any external service providers. All data, including but not limited to accommodation details, images, prices, and locations, is provided by our partnered hostels and rental agencies. All trademarks, logos, and associated marks are the property of their respective owners. For more information about our partners, please visit their official websites. All other content and design elements on this site are © HomeMate, 2024. Unauthorized use and/or duplication of this material without express and written permission from this site's author and/or owner is strictly prohibited.
            </p>
            <p className="disclaimerShort">
              © Nightmare x Blackburn, {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
          <div className="boxSocial">
            <h3>FOLLOW US</h3>
            <div className="flexi">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
            </div>
            <div className="flexi">
              <i className="fab fa-youtube"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
          <div className="box">
            <h3>HOMEMATE</h3>
            <div className="img">
              <div className="footerLogo">
                <img src="https://img.icons8.com/color/48/000000/apple-app-store--v3.png" />
                <span>App Store</span>
              </div>
              <div className="footerLogo">
                <img src="https://img.icons8.com/fluency/48/000000/google-play.png" />
                <span>Google Play Store</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;