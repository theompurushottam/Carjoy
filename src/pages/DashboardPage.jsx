import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for routing
import headerImg from "../assets/images/head2.jpg"; 
import bodyImg from "../assets/images/body.jpg"; 
import deliveredicon from "../assets/images/icons/delivered-icon.PNG";
import intransiticon from "../assets/images/icons/in-transit-icon.PNG";
import pickedicon from "../assets/images/icons/picked-icon.PNG";


// Define API base URL
const apiBaseURL = "http://127.0.0.1:5000/api";

function DashboardPage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const [showTrackingPopup, setShowTrackingPopup] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);

    const [trackingDetails, setTrackingDetails] = useState(null);
    
    const fetchTrackingDetails = async (trackingNumber) => {
        try {
          const response = await axios.get(`${apiBaseURL}/track_shipment/271898571`);
          setTrackingDetails(response.data);
          setShowTrackingPopup(true);
          console.log(response.data)
        } catch (err) {
          setError('Error fetching tracking details');
        }
      };

      const closeTrackingPopup = () => {
        setShowTrackingPopup(false);
        setTrackingDetails(null);
      };
    

    const toggleTrackingPopup = (shipment) => {
        setSelectedShipment(shipment);
        setShowTrackingPopup((prev) => !prev);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("User not logged in. Please log in again.");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            try {
                const dashboardRes = await axios.get(`${apiBaseURL}/dashboard`, { headers });
                setOrders(dashboardRes.data.orders || []);
                setShipments(dashboardRes.data.shipments || []);
                setPayments(dashboardRes.data.payments || []);
                setSubscriptions(dashboardRes.data.subscriptions || []);
                setNotifications(dashboardRes.data.notifications || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch dashboard data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleNotificationPopup = () => setNotificationPopupOpen((prev) => !prev);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationPopupOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with Background Image and Black Menu Bar */}
            <header className="bg-cover bg-center text-white min-h-[500px]" style={{ backgroundImage: `url(${headerImg})` }}>
                <div className="bg-black text-white p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="text-2xl font-bold">CargoJoy</div>

                        {/* Menu Items */}
                        <div className="flex space-x-6">
                            <a href="#dashboard" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Dashboard</a>
                            <a href="#orders-shipments" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Orders & Shipments</a>
                            <a href="#wallet" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Wallet</a>
                            <Link to="/report" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Reports</Link>
                            <a href="#billing" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Billing</a>
                            <a href="#utility" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Utility</a>
                            <Link to="/admin" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Admin</Link> {/* Added Admin Link */}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={toggleNotificationPopup}
                            className="text-white hover:bg-gray-700 p-2 rounded-full mx-4"
                        >
                            <span className="material-icons">notifications</span> ({notifications.length})
                        </button>
                        {notificationPopupOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-4">
                                <h3 className="text-lg font-bold mb-2">Notifications</h3>
                                <ul className="space-y-2">
                                    {notifications.map((notification, index) => (
                                        <li key={index} className="border-b pb-2">
                                            {notification.message}
                                        </li>
                                    ))}
                                    {notifications.length === 0 && (
                                        <li className="text-gray-500">No notifications available</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        <button
                            onClick={toggleDropdown}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700"
                        >
                            Profile
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                    Profile
                                </a>
                                <a href="/change-password" className="block px-4 py-2 hover:bg-gray-100">
                                    Change Password
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Row 1 - User Details and Plan Details */}
                <div className="flex flex-wrap pt-6 pb-24 px-12" >
                    {/* User Details Section */}
                    <div className="w-full sm:w-1/2 pr-4 mb-6 sm:mb-0">
                        <div className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] rounded-lg shadow-lg mb-6 relative p-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-semibold text-white">Hello Sunny</h2>
                                <p className="text-xl text-white">Welcome back!</p>
                                <p className="text-xl text-white">You are a premium customer! Your plan expires on 31st Dec 2025.</p>
                                <div className="absolute bottom-4 right-4">
                                    <button className="bg-white text-[#FF8474] px-6 py-3 rounded-lg shadow-md hover:bg-gray-100">
                                        Manage Subscription
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan Details Section */}
                    <div className="w-full sm:w-1/2 pr-4 mb-6 sm:mb-0">
                        <div className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] rounded-lg shadow-lg mb-6 relative p-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-semibold text-white">Plan Details</h2>
                                <p className="text-xl text-white">Your current plan gives you unlimited access to all features!</p>
                                <p className="text-xl text-white">Enjoy the benefits until your renewal date.</p>
                                <div className="absolute bottom-4 right-4">
                                    <button className="bg-white text-[#FF8474] px-6 py-3 rounded-lg shadow-md hover:bg-gray-100">
                                        Renew Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {/* Buttons Section aligned to bottom of header */}
               
                <div className="flex flex-wrap justify-between px-12 pt-12 relative gap-4" style={{marginBottom: '-24em'}}>
                    <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg w-full sm:w-auto">
                        Add Orders
                    </button>
                    <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg w-full sm:w-auto">
                        Add Money
                    </button>
                    <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg w-full sm:w-auto">
                        Raise a Ticket
                    </button>
                    <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg w-full sm:w-auto">
                        Rate Card
                    </button>
                    <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg w-full sm:w-auto">
                        Manage Account
                    </button>
                </div>

                

            </header>

            

            {/* Main Content (Body with Blocks) */}
            {/* <div className="bg-gradient-to-r from-[#696880] to-[#ADADC9"   style={{ backgroundImage: `url(${bodyImg})` }}>*/}
            <div className="bg-gradient-to-r from-[#696880] to-[#ADADC9]">
       
                <div className="flex flex-1 pt-12 px-12">
                    {/* Row 1 - Shipment and News & Updates */}
                    <div className="w-full pr-4">
                        <div className="bg-white rounded-lg shadow-lg mb-6">
                        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
                            <div className="text-lg">Shipment</div>

                            {/* View Shipment button in the header */}
                            <button
                                onClick={() => alert("View all shipments clicked")}
                                className="bg-black border text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                View Shipments
                            </button>
                            </div>

                             {/* Filter Section */}
                             
                             <div className="flex items-center gap-8 px-4 py-2">
                                {/* Filter Button for Picked Status */}
                                <button className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    Picked
                                </button>

                                {/* Filter Button for Delivered Status */}
                                <button className="bg-gradient-to-r from-[#6D9B81] to-[#A9D6B5] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    Delivered
                                </button>

                                {/* Filter Button for RTO Status */}
                                <button className="bg-gradient-to-r from-[#D180D2] to-[#F1A1F0] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    RTO
                                </button>

                                {/* Filter Button for In-Transit Status */}
                                <button className="bg-gradient-to-r from-[#6D87B2] to-[#A1C4E8] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    In-Transit
                                </button>

                                {/* Filter Button for Cancelled Status */}
                                <button className="bg-gradient-to-r from-[#C4B5AE] to-[#E1D1B7] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    Cancelled
                                </button>

                                {/* Filter Button for Lost Status */}
                                <button className="bg-gradient-to-r from-[#D56F5F] to-[#F2A7A1] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    Lost
                                </button>

                                {/* Filter Button for All Status */}
                                <button className="bg-gradient-to-r from-[#808080] to-[#B3B3B3] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all">
                                    All
                                </button>
                            </div>



                        <div className="space-y-2 min-h-[400px] max-h-[400px] overflow-y-auto p-4">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b py-2 text-left">Shipment Date</th>
                                        <th className="border-b py-2 text-left">Tracking ID</th>
                                        <th className="border-b py-2 text-left">Courier Name</th>
                                        <th className="border-b py-2 text-left">Status</th>
                                        <th className="border-b py-2 text-left">Destination</th>
                                        <th className="border-b py-2 text-left">Estimated Delivery Date</th>
                                        <th className="border-b py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipments.map((shipment) => (
                                        <tr key={shipment.id}>
                                            <td className="border-b py-2">{shipment.created_at}</td>
                                            <td className="border-b py-2">{shipment.tracking_id}</td>
                                            <td className="border-b py-2">{shipment.courier_name}</td>
                                            <td className="border-b py-2">{shipment.shipment_status}</td>
                                            <td className="border-b py-2">{shipment.current_location}</td>
                                            <td className="border-b py-2">{shipment.estimated_delivery_date}</td>
                                            <td className="border-b py-2">
                                            <button
                                                onClick={() => fetchTrackingDetails(shipment.tracking_id)}
                                                className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] px-4 py-1 rounded-lg"
                                                >
                                                Track
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    
                </div>
                {/* Main Content (Body with Blocks) */}
                <div className="flex flex-1 pt-6 px-12">
                    {/* Row 1 - Shipment and News & Updates */}
                    <div className="w-3/4 pr-4">
                        <div className="bg-white rounded-lg shadow-lg mb-6">
                            <div className="bg-black text-white p-4 rounded-t-lg">Orders</div>
                            <div className="space-y-2 min-h-[400px] max-h-[400px] overflow-y-auto p-4">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b py-2 text-left">Order Date</th>
                                        <th className="border-b py-2 text-left">Oder ID</th>
                                        <th className="border-b py-2 text-left">Status </th>
                                        <th className="border-b py-2 text-left">Source</th>
                                        <th className="border-b py-2 text-left">Destination</th>
                                        <th className="border-b py-2 text-left">Item Desc</th>
                                        <th className="border-b py-2 text-left">Weight</th>
                                        <th className="border-b py-2 text-left">Payment</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((item) => (
                                        <tr key={item.id}>
                                            <td className="border-b py-2">{item.created_at}</td>
                                            <td className="border-b py-2">{item.id}</td>
                                            <td className="border-b py-2">{item.order_status}</td>
                                            <td className="border-b py-2">{item.source_address}</td>
                                            <td className="border-b py-2">{item.destination_address}</td>
                                            <td className="border-b py-2">{item.item_description}</td>
                                            <td className="border-b py-2">{item.weight}</td>
                                            <td className="border-b py-2">{item.payment_status}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             </div>
                        </div>
                    </div>

                    <div className="w-1/4 pl-4">
                        <div className="bg-white rounded-lg shadow-lg mb-6">
                            <div className="bg-black text-white p-4 rounded-t-lg">Payment</div>
                            <div className="space-y-2  min-h-[400px] max-h-[300px] overflow-y-auto p-4">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="space-y-2">
                                        <div>{notification.message}</div>
                                    </div>
                                ))}
                            </div>
                            </div>
                    </div>
                   
                </div>
                
                
                <div className="flex flex-1 pt-6 px-12">
                  
                  <div className="w-full pr-4">
                    <div className="bg-[#FF8474] p-4 shadow-lg mb-12">
                        <div className="bg-white rounded-lg shadow-lg mb-6">
                            <div className="bg-black text-white p-4 rounded-t-lg">Help & Support</div>
                            <div className="space-y-2  min-h-[200px] max-h-[200px] overflow-y-auto p-4">
                            <p>For assistance, please call our customer support at +91 123 456 789 or email us.</p>
                            </div>
                        </div>
                     </div>
                  </div>

                  
              </div>
           

               
            </div>
           {/* Tracking Details Popup */}
           {showTrackingPopup && trackingDetails && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 sm:w-1/3">
                    <div className="flex flex-col">
                        {/* Tracking Info Section */}
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-semibold text-green-600">Shipment</div>
                            <div className="text-xl text-gray-600 font-bold">FREE</div>
                        </div>
        
                        <div className="text-lg text-gray-600 mt-2">(1 item)</div>
        
                        {/* Item Info Section */}
                        <div className="mt-4">
                            <div className="text-xl font-semibold text-gray-800">Item:</div>
                            <div className="text-lg text-gray-600 mt-2">Tracking ID: {trackingDetails?.data?.lrnum}</div>
                        </div>
        
                        {/* Date & Time Section */}
                        <div className="mt-6">
                            <div className="text-xl font-semibold text-gray-800">On:</div>
                            <div className="text-lg text-gray-600 mt-2">
                                {trackingDetails?.data?.wbns[0]?.pickup_date}
                            </div>
                            <div className="text-lg text-gray-600 mt-2">
                                Estimated between   {trackingDetails?.data?.wbns[0]?.promised_delivery_date} - {trackingDetails?.data?.wbns[0]?.estimated_date}
                            </div>
                        </div>
        
                        {/* Sender Info Section */}
                        <div className="mt-6">
                            <div className="text-xl font-semibold text-gray-800">From:</div>
                            <div className="text-lg text-gray-600 mt-2">
                                {trackingDetails?.data?.sender_name}
                            </div>
                            <div className="text-lg text-gray-600 mt-2">
                                {trackingDetails?.data?.wbns[0]?.location}
                            </div>
                        </div>
                        {/* Tracking Status */}
                        <div className="mt-4 text-lg font-semibold text-gray-600">
                            <div>Status:</div>
                            <div className="text-xl font-bold text-gray-800"> {trackingDetails?.data?.wbns[0]?.status} </div>
                            <div className="text-sm text-gray-500 mt-2"> {trackingDetails?.data?.wbns[0]?.wbn}</div>
                        </div>
                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-between">
                           
                            <button className="text-green-600 hover:text-green-800 font-semibold">Add to Calendar</button>
                            <button className="text-red-600 hover:text-red-800 font-semibold"  onClick={closeTrackingPopup}>Cancel</button>
                        </div>
        
                        
        
                        {/* Close Button */}
                        <div className="mt-6">
                            <button
                                onClick={closeTrackingPopup}
                                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Footer */}
            <footer className="bg-black text-white py-4 text-center mt-6">
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="hover:text-gray-400">Facebook</a>
                    <a href="#" className="hover:text-gray-400">Instagram</a>
                    <a href="#" className="hover:text-gray-400">Twitter</a>
                </div>
            </footer>
        </div>
    );
}

export default DashboardPage;
