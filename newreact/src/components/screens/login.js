import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../axios";
import endpoint from "../../endpoints";
import * as Image from "../image";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const authLogin = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Email field is required");
      return;
    }
    if (password === "") {
      toast.error("Password field is required");
      return;
    }
  
    const payload = {
      email: email,
      password: password,
    };
  
    console.log("Payload:", payload);
  
    try {
      const res = await axios.post(`${endpoint.LOGIN}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response data:", res);
      if (res.data.status === false) {
        toast.error(res.data?.message);
      } else {
        toast.success(res.data?.message);
        const { token, user } = res.data?.response;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      console.log("Login catch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  

  return (
    <div className="container-fluid login bg-white p-5">
      <div className="row">
        <div className="col-md-6">
          <div className="login-container">
            <div className="login-header">
              <FontAwesomeIcon icon={faRightToBracket} className="icon" />
              <h3 className="text-center">Welcome back</h3>
            </div>
            <h4>Please enter your details to sign in</h4>
            <form onSubmit={authLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <FontAwesomeIcon icon={faEnvelope} className="icon-left" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <FontAwesomeIcon icon={faLock} className="icon-left" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="eye-icon"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
              <div className="input-group">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block">
          <img className="loginimg" src={Image.Login} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
