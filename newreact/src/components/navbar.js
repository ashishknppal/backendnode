import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming 'user' object is stored
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className="navbar">
      <div className="toggle-sidebar-btn" onClick={toggleSidebar}>
        <FaBars />
        <div className="logo">
          <h1>Khattri</h1>
        </div>
      </div>
      <div className="nav-items">
        <FaBell className="nav-icon" />
        <FaUserCircle className="nav-icon" />
        <span>{userName || "Guest"}</span> 
      </div>
    </div>
  );
};

export default Navbar;
