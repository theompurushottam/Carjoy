import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/register", { name, email, password });
            setMessage("Registration successful! You can now log in.");
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            setMessage("Registration failed. Please try again."+error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-400">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create an Account
                </h1>
                {message && (
                    <p className="text-center text-green-600 mb-4 font-semibold">{message}</p>
                )}
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 font-bold hover:underline">
                        Log in here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
