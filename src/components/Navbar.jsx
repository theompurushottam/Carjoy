import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-bold">CargoJoy</h1>
            <div>
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    );
}

export default Navbar;
