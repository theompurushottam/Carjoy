import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/login", { email, password },{
                headers: {
                    "Content-Type": "application/json", // Explicitly set the content type
                }
            });
            localStorage.setItem("access_token", response.data.access_token);
            console.log(' response.data.access_token', response.data.access_token);
            setMessage("Login successful!");
            console.log("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            setMessage("Login failed. Please check your credentials.");
        }
    };
    

    return (
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#ADADC9]"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#ADADC9]"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#696880] to-[#ADADC9] text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition"
                >
                    Login
                </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
                Don’t have an account?{" "}
                <a href="/register" className="text-blue-500 font-bold hover:underline">
                    Register here
                </a>
            </p>
        </div>
    );
}

export default LoginPage;