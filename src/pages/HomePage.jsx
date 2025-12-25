import React from "react";

function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-green-400">
            <h1 className="text-5xl font-bold text-white mb-6">Welcome to CargoJoy</h1>
            <p className="text-lg text-white mb-6">
                Streamline your shipping with ease and efficiency.
            </p>
            <div className="space-x-4">
                <a
                    href="/login"
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Login
                </a>
                <a
                    href="/register"
                    className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Register
                </a>
            </div>
        </div>
    );
}

export default HomePage;
