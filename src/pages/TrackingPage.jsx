import React, { useState } from "react";

function TrackingPage() {
    const [trackingNumber, setTrackingNumber] = useState("");

    const handleTrack = (e) => {
        e.preventDefault();
        if (trackingNumber) {
            alert(`Tracking shipment: ${trackingNumber}`);
        } else {
            alert("Please enter a valid tracking number.");
        }
    };

    return (
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Track Your Shipment</h2>
            <form onSubmit={handleTrack}>
                <input
                    type="text"
                    placeholder="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#ADADC9]"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#696880] to-[#ADADC9] text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition mt-4"
                >
                    Track
                </button>
            </form>
        </div>
    );
}

export default TrackingPage;
