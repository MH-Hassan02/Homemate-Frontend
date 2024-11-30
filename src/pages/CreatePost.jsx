import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiUpload, FiMapPin, FiCheckSquare, FiX } from "react-icons/fi";
import {
  BsHouseDoor,
  BsFillLightbulbFill,
  BsWifi,
  BsFillDropletFill,
} from "react-icons/bs";
import {
  FaSwimmingPool,
  FaParking,
  FaTree,
  FaFireExtinguisher,
} from "react-icons/fa";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const amenitiesOptions = [
  { id: 1, label: "Wi-Fi", icon: <BsWifi /> },
  { id: 2, label: "Parking", icon: <FaParking /> },
  { id: 3, label: "Swimming Pool", icon: <FaSwimmingPool /> },
  { id: 4, label: "Garden", icon: <FaTree /> },
  { id: 5, label: "Fire Extinguisher", icon: <FaFireExtinguisher /> },
  { id: 6, label: "Water Supply", icon: <BsFillDropletFill /> },
  { id: 7, label: "Electricity", icon: <BsFillLightbulbFill /> },
  { id: 8, label: "Security", icon: <BsHouseDoor /> },
  { id: 9, label: "Heating", icon: <FaFireExtinguisher /> },
  { id: 10, label: "Air Conditioning", icon: <FiCheckSquare /> },
];

function LocationInput({ location, setLocation }) {
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={location || [51.505, -0.09]}
      zoom={13}
      className="h-52 w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      {location && <Marker position={location} />}
    </MapContainer>
  );
}

const CreatePost = () => {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [utilityBill, setUtilityBill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const options = ["malir", "jauhar", "maymar","bahadurabad", "saddar", "gulshan"];

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setValue("area", option);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to create a post. Redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUtilityBillChange = (e) => {
    const file = e.target.files[0];
    setUtilityBill(file);
  };

  const handleRemoveUtilityBill = () => {
    setUtilityBill(null);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setLocation(newLocation);
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Please log in to submit the form.");
        return;
      }

      // Create FormData for image uploads
      const formDataImages = new FormData();
      images.forEach((image) => formDataImages.append("images", image)); // Append images

      // Upload images to Cloudinary
      const responseImages = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload/images`,
        formDataImages, // FormData should be the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Ensure API returns an array of image URLs
      const imageUrls = responseImages.data.imageUrls || []; // Modify according to actual API response

      // Upload utility bill if provided
      let utilityBillUrl = null;
      if (utilityBill) {
        const formDataUtility = new FormData();
        formDataUtility.append("utility", utilityBill);
        const responseUtility = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/upload/utilityimage`,
          formDataUtility,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        utilityBillUrl = responseUtility.data.imageUrl || null;
      }

      // Prepare the post data
      const postData = {
        title: data.title,
        address: data.address,
        description: data.description,
        area: data.area,
        details: [
          {
            peopleLiving: parseInt(data.people),
            bedsAvailable: parseInt(data.beds),
          },
        ],
        price: parseInt(data.rent),
        deposit: parseInt(data.deposit),
        amenities: selectedAmenities,
        images: imageUrls,
        location: {
          longitude: location[1],
          latitude: location[0],
        },
        utilityBill:
          utilityBillUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
        ratings: 0,
        remarks: "",
        featuredAdd: false,
      };

      // Send the post data to your API with authorization header
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/posts/createpost`,
        postData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      if (response.status === 200) {
        alert("Post created successfully!");
        navigate("/"); // Redirect to the homepage or a success page
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center space-y-4 p-6 font-Poppins max-w-screen-xl m-auto overflow-auto"
      >
        <h1 className="text-4xl font-semibold font-Poppins">Rent your place</h1>
        <input
          {...register("title", { required: "Title is required" })}
          type="text"
          placeholder="Title"
          className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
        <input
          {...register("address", { required: "Address is required" })}
          type="text"
          placeholder="Address"
          className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
        />
        {errors.address && (
          <span className="text-red-500">{errors.address.message}</span>
        )}
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
          className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
        <h1 className="text-4xl font-semibold font-Poppins">Details</h1>
        <div className="flex flex-wrap gap-8">
          <div className="w-[600px]">
            <input
              {...register("people", {
                required: "Number of people is required",
              })}
              type="number"
              placeholder="Number of People"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.people && (
              <span className="text-red-500">{errors.people.message}</span>
            )}
          </div>
          <div className="w-[600px]">
            <input
              {...register("beds", { required: "Number of beds is required" })}
              type="number"
              placeholder="Beds Available"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.beds && (
              <span className="text-red-500">{errors.beds.message}</span>
            )}
          </div>
          <div className="w-[600px]">
            <input
              {...register("deposit", {
                required: "Deposit amount is required",
              })}
              type="number"
              placeholder="Deposit"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.deposit && (
              <span className="text-red-500">{errors.deposit.message}</span>
            )}
          </div>
          <div className="w-[600px]">
            <input
              {...register("rent", { required: "Monthly rent is required" })}
              type="number"
              placeholder="Monthly Rent"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.rent && (
              <span className="text-red-500">{errors.rent.message}</span>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-semibold font-Poppins">Images</h1>
        <div className="relative">
          <label
            htmlFor="image-upload"
            className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-300 rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 relative cursor-pointer"
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <FiUpload className="text-gray-500" />
          </label>
          {images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-white text-gray-500 rounded-full p-1"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <h1 className="text-4xl font-semibold font-Poppins">Utility bill</h1>
        <p className="text-xs">Your address will be verified with this</p>
        <div className="relative">
          <label
            htmlFor="utility-bill-upload"
            className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-300 rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 relative cursor-pointer"
          >
            <input
              id="utility-bill-upload"
              type="file"
              accept="application/pdf, image/*"
              onChange={handleUtilityBillChange}
              className="hidden"
            />
            <FiUpload className="text-gray-500" />
          </label>
          {utilityBill && (
            <div className="relative mt-2">
              <img
                src={URL.createObjectURL(utilityBill)}
                alt="Utility Bill Preview"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveUtilityBill}
                className="absolute top-1 right-1 bg-white text-gray-500 rounded-full p-1"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-semibold font-Poppins">Amenities</h1>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAmenities(!showAmenities)}
            className="w-full flex items-center justify-between border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
          >
            <span>Select Amenities</span>
            <FiCheckSquare />
          </button>
          {showAmenities && (
            <div className="w-full bg-white border border-primary rounded-md mt-2 p-2">
              {amenitiesOptions.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    {amenity.icon} <span>{amenity.label}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.label)}
                    onChange={() => handleAmenityChange(amenity.label)}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          {selectedAmenities.length > 0 && (
            <ul className="list-disc pl-5 text-[16px]">
              {selectedAmenities.map((amenity, idx) => (
                <li key={idx} className="text-primary">
                  <span className="text-black">{amenity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* **new work** */}
        <div className="relative w-full">
          <button
            type="button"
            className="w-full text-left border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary flex justify-between items-center"
            onClick={handleDropdownToggle}
            aria-haspopup="listbox"
            aria-expanded={showDropdown ? "true" : "false"}
          >
            {selectedOption ? selectedOption : "Select an Area"}
            <svg
              className={`w-5 h-5 transition-transform ${
                showDropdown ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {showDropdown && (
            <ul
              role="listbox"
              className="absolute z-10 mt-1 w-full bg-white border-2 border-primary rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
            >
              {options.map((option, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer hover:bg-primary hover:text-white ${
                    selectedOption === option
                      ? "bg-primary text-white"
                      : "text-black"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={selectedOption === option ? "true" : "false"}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {/* Validation error */}
          {errors.area && (
            <span className="text-red-500">{errors.area.message}</span>
          )}
        </div>
        {/* **new work** */}
        <h1 className="text-4xl font-semibold font-Poppins">Location</h1>
        <button
          type="button"
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md"
          onClick={handleLocationClick}
        >
          <FiMapPin /> <span>Set Location</span>
        </button>
        {location && (
          <LocationInput location={location} setLocation={setLocation} />
        )}
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className={`bg-primary text-white px-4 py-2 rounded-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-black px-4 py-2 rounded-md"
            onClick={() => {
              // Implement save as draft functionality here
              console.log("Save as draft");
            }}
          >
            Save as Draft
          </button>
        </div>
      </form>
    </>
  );
};

export default CreatePost;
