import React, { useState } from "react";
import { BsHouse, BsDatabaseAdd, BsFileText, BsGearFill } from "react-icons/bs";
import axios from "../axios";
import endpoint from "../endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMoneyCheckAlt,FaReceipt, FaUndo,FaEnvelope, FaFileInvoiceDollar, FaFileContract } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);

  const handleSetActive = (path) => {
    setActiveTab(path);
  };

  const toggleMasterDropdown = () => {
    setIsMasterDropdownOpen((prev) => !prev);
  };

  const authLogout = async () => {
    try {
      const res = await axios.post(`${endpoint.LOGOUT}`);
      console.log("Response data:", res);
      if (res.data.status === false) {
        toast.error(res.data?.message);
      } else {
        toast.success(res.data?.message);
        navigate("/");
        localStorage.remove("authToken");
        localStorage.remove("user");
        // localStorage.clear();
      }
    } catch (error) {
      console.log("Login catch error:", error.response?.data || error.message);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className={isOpen ? "sidebar open" : "sidebar"}>
      <div className="menu-items">
        <Link
          to="/home"
          className={activeTab === "/home" ? "active" : ""}
          onClick={() => handleSetActive("/home")}
        >
          <BsHouse /> {isOpen && "Dashboard"}
        </Link>
        <div className="dropdown">
          <Link
            to="#"
            className={activeTab === "/master" ? "active" : ""}
            onClick={() => {
              handleSetActive("/master");
              toggleMasterDropdown();
            }}
          >
            <BsDatabaseAdd /> {isOpen && "CMS Management"}
          </Link>
          {isMasterDropdownOpen && (
            <div className="dropdown-menu">
              <Link
                to="/cms"
                className={activeTab === "/cms" ? "active" : ""}
                onClick={() => {
                  handleSetActive("/cms");
                  toggleMasterDropdown();
                }}
              >
                CMS
              </Link>
              <Link
                to="/cms-content"
                className={activeTab === "/cms-content" ? "active" : ""}
                onClick={() => {
                  handleSetActive("/cms-content");
                  toggleMasterDropdown();
                }}
              >
                CMS Content
              </Link>
            </div>
          )}
        </div>
        <Link
          to="/client"
          className={activeTab === "/client" ? "active" : ""}
          onClick={() => handleSetActive("/client")}
        >
          <FaFileInvoiceDollar /> {isOpen && "Apply For Account"}
        </Link>  
        <Link
          to="/career"
          className={activeTab === "/career" ? "active" : ""}
          onClick={() => handleSetActive("/career")}
        >
          <FaFileContract /> {isOpen && "Career"}
        </Link>
  
       <Link
          to="/news"
          className={activeTab === "/news" ? "active" : ""}
          onClick={() => handleSetActive("/news")}
        >
          <FaFileContract /> {isOpen && "News And Notification"}
        </Link>
        
        <Link
          to="/interest"
          className={activeTab === "/interest" ? "active" : ""}
          onClick={() => handleSetActive("/interest")}
        >
          <FaFileContract /> {isOpen && "Interest Management"}
        </Link>     
        <Link
          to="/enquiry"
          className={activeTab === "/enquiry" ? "active" : ""}
          onClick={() => handleSetActive("/enquiry")}
        >
          <FaFileContract /> {isOpen && "Enquiry For Loan"}
        </Link>  
        
        <Link
          to="/feedback"
          className={activeTab === "/feedback" ? "active" : ""}
          onClick={() => handleSetActive("/feedback")}
        >
          <BsFileText /> {isOpen && "Suggest/Feedback"}
        </Link>
      
        <Link
          to="/settings"
          className={activeTab === "/settings" ? "active" : ""}
          onClick={() => handleSetActive("/settings")}
        >
          <BsGearFill /> {isOpen && "Settings"}
        </Link>
        <Link
          className={activeTab === "/logout" ? "active" : ""}
          onClick={() => {
            authLogout();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
          {isOpen && "Logout"}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
