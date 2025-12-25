import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { Link } from "react-router-dom";
import headerImg from "../assets/images/head2.jpg";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define API base URL
const apiBaseURL = 'http://127.0.0.1:5000/api';

function ReportsPage() {
  const [reportsData, setReportsData] = useState(null);

  useEffect(() => {
    // Fetch reports data from the backend
    axios
      .get(`${apiBaseURL}/report`) // Your backend endpoint
      .then((response) => setReportsData(response.data))
      .catch((error) => console.error("Error fetching report data:", error));
  }, []);

  // Generate charts and display reports if data is loaded
  if (!reportsData) {
    return <div>Loading...</div>;
  }

  // Data for Orders Status Distribution
  const ordersStatusData = {
    labels: reportsData.orders_status.map((item) => item.order_status), // Set the correct label (status)
    datasets: [
      {
        label: "Orders by Status",
        data: reportsData.orders_status.map((item) => item.count), // Set the correct data (count)
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Data for Shipments Status Distribution
  const shipmentsStatusData = {
    labels: reportsData.shipments_status.map((item) => item.shipment_status), // Set the correct label (status)
    datasets: [
      {
        label: "Shipments by Status",
        data: reportsData.shipments_status.map((item) => item.count), // Set the correct data (count)
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Data for Top 5 Districts by Orders
  const topDistrictsData = {
    labels: reportsData.top_districts.map((item) => item.district), // Set the correct label (district)
    datasets: [
      {
        label: "Top Districts by Orders",
        data: reportsData.top_districts.map((item) => item.order_count), // Set the correct data (order count)
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-cover bg-center text-white min-h-[400px]" style={{ backgroundImage: `url(${headerImg})` }}>
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold">CargoJoy</div>
            <div className="flex space-x-6">
              <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Dashboard</Link>
              <a href="#orders-shipments" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Orders & Shipments</a>
              <a href="#wallet" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Wallet</a>
              <Link to="/report" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Reports</Link>
              <a href="#billing" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Billing</a>
              <a href="#utility" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Utility</a>
              <Link to="/admin" className="px-4 py-2 hover:bg-gray-700 rounded-lg">Admin</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#FF8474]">Total Orders (Last 30 Days)</h2>
          <p className="text-3xl font-bold">{reportsData.total_orders_count}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#FF8474]">Total Shipments (Last 30 Days)</h2>
          <p className="text-3xl font-bold">{reportsData.total_shipments_count}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#FF8474]">Estimated Revenue (Last 30 Days)</h2>
          <p className="text-3xl font-bold">Rs.{reportsData.total_weight * 5}</p> {/* Example revenue estimation */}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-[#FF8474]">Orders Status Distribution</h2>
        <Bar data={ordersStatusData} options={{ responsive: true }} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-[#FF8474]">Shipments Status Distribution</h2>
        <Bar data={shipmentsStatusData} options={{ responsive: true }} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-[#FF8474]">Top Districts by Orders</h2>
        <Bar data={topDistrictsData} options={{ responsive: true }} />
      </div>
    </div>
  );
}

export default ReportsPage;
