import React from "react";
import LoginPage from "./LoginPage.jsx";
import TrackingPage from "./TrackingPage.jsx";
import heroImage from "../assets/images/hero-image2.jpg"; // Adjust the path to your image
import bodyImg from "../assets/images/body.jpg"; // Adjust the path to your image

function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#696880] via-[#ADADC9] to-[#fff]">
            {/* Header */}
            <header className="w-full bg-black text-white py-4 px-6 flex items-center shadow-lg">
                <div className="text-2xl font-bold flex-grow">CargoJoy</div>
                <nav className="flex-grow">
                    <ul className="flex justify-center space-x-8">
                        <li>
                            <a href="/" className="hover:underline">Home</a>
                        </li>
                        <li>
                            <a href="/pricing" className="hover:underline">Pricing</a>
                        </li>
                        <li>
                            <a href="/about" className="hover:underline">About</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </nav>
                <button className="text-white hover:bg-[#e67f22] rounded-full p-2 focus:outline-none">
                    <span className="material-icons">notifications</span>
                </button>
            </header>

            {/* Main Body */}
            <main className="flex flex-1 items-stretch" style={{ backgroundImage: `url(${bodyImg})` }}>
                {/* Hero Section (Left) */}
                <div className="w-3/5 p-8 flex flex-col justify-center space-y-6">

                    <p className="text-black-200 text-lg leading-relaxed animate-slideIn">
                        Welcome to <span className="text-yellow-300">CargoJoy</span>! Manage your logistics with ease.
                    </p>
                </div>

                {/* Login & Tracking Section (Right) */}
                <div className="w-2/5 p-8 flex flex-col justify-between">
                    {/* Login Section */}
                    <div className="bg-white text-gray-800 py-32 px-8 rounded-lg shadow-lg">
                        <LoginPage />
                    </div>

                    {/* Tracking Section */}
                    {/* 
                    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                        <TrackingPage />
                    </div>
                    */}
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-black text-white py-6 text-center">
                <p className="text-lg font-bold">CargoJoy</p>
                <p className="text-sm">© 2024 CargoJoy. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
