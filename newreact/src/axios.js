// import ax from "axios";

// const axios = ax.create({

//   baseURL: "http://localhost:3000/api/",
// });
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// export default axios;

import axios from "axios";

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Get the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access
      console.error("Unauthorized access - redirecting to login.");
      window.location.href = "/"; // Adjust the path if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
