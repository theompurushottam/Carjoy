import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "https://python-backend-ex9x.onrender.com", // Replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
