import React, { useEffect } from "react";
import axiosInstance from "./api/axiosInstance";

function TestAxios() {
    useEffect(() => {
        const testAPI = async () => {
            try {
                const response = await axiosInstance.get("/");
                console.log("API Response:", response.data);
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        testAPI();
    }, []);

    return <div>Testing Axios Instance...</div>;
}

export default TestAxios;
