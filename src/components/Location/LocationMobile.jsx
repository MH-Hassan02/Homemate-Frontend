import React from "react";
import "./LocationMobile.css";

const LocationMobile = () => {
  const locations = [
    { id: 1, name: "Gulshan", img: "https://picsum.photos/200/200" },
    { id: 2, name: "Malir", img: "https://picsum.photos/200/160" },
    { id: 3, name: "Bahadurabad", img: "https://picsum.photos/160/120" },
    { id: 4, name: "Jauhar", img: "https://picsum.photos/200/250" },
    { id: 5, name: "Maymar", img: "https://picsum.photos/200/120" },
    { id: 6, name: "Saddar", img: "https://picsum.photos/200/220" },
  ];

  return (
    <div className="location-mobile" data-aos="fade-up" data-aos-duration="500">
      <h1>Popular Locations</h1>
      <div className="location-list">
        {locations.map((location) => (
          <div key={location.id} className="location-item">
            <img src={location.img} alt={location.name} />
            <label>{location.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationMobile;
