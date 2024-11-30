import React, { useState } from "react";
import "./Book.css";
import { FaExclamation, FaPlus, FaTimes } from "react-icons/fa";

const Book = ({ post, isMobile }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className={`bookMain ${isMobile ? 'modalHidden' : ''}`}>
        <div className="ratePanel">
          <span>PKR</span>
          <span>{post.price}</span>
          <p>/ Month</p>
        </div>
        <div className="formPanel">
          <input type="number" placeholder="Guests" />
          <textarea
            name=""
            id=""
            placeholder="Enquire to the admin about this property"
          ></textarea>
          <button className="bookBtn">Request to Book</button>
          <div className="disclaimerPanel">
            <p>
              <span>
                <FaExclamation />
              </span>
              You won't be charged yet
            </p>
            <p>
              <span>
                <FaExclamation />
              </span>
              Your personal information will be used solely for the purposes of
              the booking and will not be shared with third parties, except as
              required by law.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <button className="closeModalBtn" onClick={toggleModal}>
              <FaTimes size={20} color="red" />
            </button>
            <div className="bookMain bookMainModal">
              <div className="ratePanel">
                <span>PKR</span>
                <span>{post.price}</span>
                <p>/ Month</p>
              </div>
              <div className="formPanel">
                <input type="number" placeholder="Guests" />
                <textarea
                  name=""
                  id=""
                  placeholder="Enquire to the admin about this property"
                ></textarea>
                <button className="bookBtn">Request to Book</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className={`floatingBtn ${showModal ? "hide" : ""}`}
        onClick={toggleModal}
      >
        <FaPlus size={30} color="#fff" />
      </button>
    </>
  );
};

export default Book;
