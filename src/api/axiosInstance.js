import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5000/api", // Replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
