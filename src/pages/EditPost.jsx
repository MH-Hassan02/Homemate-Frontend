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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { fetchPostById } from "../redux/slices/postSlice"; // Update this path based on your structure
import { useDispatch } from "react-redux";

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
  function UpdateMapCenter({ location }) {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation([lat, lng]);
      },
    });

    useEffect(() => {
      if (location) {
        map.setView(location, 15);
      }
    }, [location, map]);

    return null;
  }

  const mapCenter = location || [51.505, -0.09];

  return (
    <MapContainer center={mapCenter} zoom={13} className="map-container">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {location && <Marker position={location} />}
      {location && <UpdateMapCenter location={location} />}
    </MapContainer>
  );
}

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch post from Redux state
  const post = useSelector((state) => state.posts.post);
  console.log(post);
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [utilityBill, setUtilityBill] = useState(null);
  const [utilityBillUrl, setUtilityBillUrl] = useState(
    post?.utilityBill || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [utilityBillFile, setUtilityBillFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const token = localStorage.getItem("authToken");


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPostById(id));
    } else {
      setValue("title", post.title);
      setValue("address", post.address);
      setValue("description", post.description);
      setValue("people", post.details[0]?.peopleLiving);
      setValue("beds", post.details[0]?.bedsAvailable);
      setValue("deposit", post.deposit);
      setValue("rent", post.price);
      setValue("area", post.area);
      setSelectedAmenities(post.amenities);
      setLocation([post.location.latitude, post.location.longitude]);
      setUtilityBillUrl(post.utilityBill);
      setImages(post.images);
      if (post.utilityBill) {
        setUtilityBill(post.utilityBill);
      }
    }
  }, [post, id, setValue, dispatch]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);
    setSelectedImages(newImages);
  };

  const handleUtilityBillChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUtilityBill(file);
      setUtilityBillFile(file);
    }
  };

  const handleRemoveUtilityBill = () => {
    if (!utilityBill) return;
    setUtilityBill(null);
  };

  const deleteUtilityBill = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/upload/utilitybill`,
        {
          data: { postId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Old utility bill deleted from Cloudinary.");
    } catch (error) {
      console.error("Error deleting utility bill:", error);
    }
  };

  const uploadImages = async (images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.imageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleRemoveImage = (index) => {
    const removedImage = images[index];
    setRemovedImages((prev) => [...prev, removedImage]); 
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (!utilityBill && !utilityBillFile) {
      alert("Please upload at least one utility bill image.");
      return;
    }

    if (selectedImages.length === 0 && images.length === 0) {
      alert("Please upload at least one regular image.");
      return; 
    }

    setIsLoading(true);

    try {
      let newUtilityBillUrl = utilityBillUrl; 

      if (utilityBill && utilityBillFile) {
        newUtilityBillUrl = await uploadUtilityBill(utilityBill);
      }

      if (utilityBill && utilityBillUrl && utilityBillFile) {
        await deleteUtilityBill(id); 
      }

      for (const removedImage of removedImages) {
        await deleteImageFromCloudinary(removedImage, id);
      }

      let imageUrls = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages); 

        const filteredImages = images.filter(
          (image) => typeof image === "string" && image.trim() !== ""
        );

        imageUrls = [...imageUrls, ...filteredImages];
      } else {
        imageUrls = images;
      }

      const postData = {
        title: data.title,
        description: data.description,
        images: imageUrls, 
        utilityBill: newUtilityBillUrl, 
        address: data.address,
        peopleLiving: data.people,
        bedsAvailable: data.beds,
        deposit: data.deposit,
        price: data.rent,
        amenities: selectedAmenities,
        location: {
          latitude: location[0],
          longitude: location[1],
        },
      };

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/editPost/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post updated successfully!");
      navigate(`/`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageFromCloudinary = async (imageUrl, postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/upload/images`,
        {
          data: { imageUrl, postId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Image deleted from Cloudinary:", imageUrl);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };

  const uploadUtilityBill = async (file) => {
    const formData = new FormData();
    formData.append("utility", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload/utilityimage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading utility bill:", error);
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center space-y-4 p-6 font-Poppins max-w-screen-xl m-auto overflow-auto"
      >
        <h1 className="text-4xl font-semibold font-Poppins">Edit your post</h1>

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
          className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary h-[100px]"
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
              placeholder="People Living"
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
              {...register("rent", { required: "Rent is required" })}
              type="number"
              placeholder="Rent"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.rent && (
              <span className="text-red-500">{errors.rent.message}</span>
            )}
          </div>

          <div className="w-[600px]">
            <input
              {...register("deposit", { required: "Deposit is required" })}
              type="number"
              placeholder="Deposit"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.deposit && (
              <span className="text-red-500">{errors.deposit.message}</span>
            )}
          </div>
        </div>

        <h1 className="text-4xl font-semibold font-Poppins">Images</h1>
        <div className="relative">
          <label className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-300 rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <FiUpload className="text-gray-500" />
          </label>
          <div className="flex gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        <h1 className="text-4xl font-semibold font-Poppins">Utility bill</h1>
        <div className="relative">
          <label
            htmlFor="utility-bill"
            className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-300 rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 relative cursor-pointer"
          >
            <FiUpload className="text-gray-500" />
          </label>
          <input
            id="utility-bill"
            type="file"
            accept="image/*"
            onChange={handleUtilityBillChange}
            className="hidden"
          />
          {utilityBill && (
            <div className="relative mt-2">
              <img
                src={
                  typeof utilityBill === "string"
                    ? utilityBill
                    : URL.createObjectURL(utilityBill)
                }
                alt="Utility Bill"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveUtilityBill}
                className="absolute top-1 left-20 bg-red-500 text-white rounded-full p-1"
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
            className="w-full flex items-center justify-between border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary"
            onClick={() => setShowAmenities((prev) => !prev)}
          >
            Select Amenities
          </button>
          {showAmenities && (
            <div className="w-full bg-white border border-primary rounded-md mt-2 p-2">
              {amenitiesOptions.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={amenity.label}
                    checked={selectedAmenities.includes(amenity.label)}
                    onChange={() => handleAmenityChange(amenity.label)}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor={amenity.label}
                    className="flex items-center space-x-2"
                  >
                    {amenity.icon}
                    <span className="ml-2">{amenity.label}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full">
            <input
              {...register("area", { required: "area is required" })}
              type="text"
              placeholder="area"
              className="border-2 border-primary rounded-md p-2 focus:outline-none focus:border-primary w-full"
            />
            {errors.deposit && (
              <span className="text-red-500">{errors.deposit.message}</span>
            )}
          </div>

        <h1 className="text-4xl font-semibold font-Poppins">Location</h1>
        <LocationInput location={location} setLocation={setLocation} />

        <button
          type="submit"
          className={`bg-primary text-white px-4 py-2 rounded-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </>
  );
};

export default EditPost;
