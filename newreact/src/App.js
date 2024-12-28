import React, { useState } from "react";
import AppRoute from "./routers/route";
import Navbar from "./components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/sidebar";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import "./App.css";
import { ToastContainer, Bounce, Flip, Zoom, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App_route() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const hiddenComponentsRoutes = ["/"];

  const shouldHideComponents = hiddenComponentsRoutes.includes(
    location.pathname
  );
  return (
    <div className="App">
      <ToastContainer
        theme="light"
        closeOnClick
        autoClose={2000}
        position="top-right"
        transition={Zoom}
      />

      {!shouldHideComponents && <Navbar toggleSidebar={toggleSidebar} />}
      <div
        className={`main-container ${
          shouldHideComponents ? "login-page" : ""
        } ${!isSidebarOpen ? "collapsed" : ""}`}
      >
        {!shouldHideComponents && <Sidebar isOpen={isSidebarOpen} />}
        <div className="content">
          <AppRoute />
        </div>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <App_route />
    </Router>
  );
}
export default App;
