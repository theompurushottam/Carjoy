import React, { useState, useEffect, useRef } from "react";
import CSVReader from 'react-csv-reader';
import axios from 'axios';
import { Link } from "react-router-dom"; // Import Link for routing
import headerImg from "../assets/images/head2.jpg"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 

// Define API base URL
const apiBaseURL = 'http://127.0.0.1:5000/api';
const apis = [
  {
    name: "Cancel Pickup Request",
    endpoint: "/api/cancel_pickup",
    params: ["pickup_id"],
  },
  {
    name: "Manifestation Status",
    endpoint: "/api/order_manifestation_status",
    params: ["order_id"],
  },
  {
    name: "Edit LR",
    endpoint: "/api/edit_lr",
    params: ["lr_number", "details"],
  },
  {
    name: "Get Shipping Labels",
    endpoint: "/api/shipping_labels",
    params: ["shipment_id"],
  },
  {
    name: "Freight Charges",
    endpoint: "/api/freight_charges",
    params: ["details"],
  },
  {
    name: "Cancel Shipment",
    endpoint: "/api/cancel_shipment",
    params: ["shipment_id"],
  },
];




function AdminPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);
  
  const [selectedMenu, setSelectedMenu] = useState('uploadShipment'); // Track the selected menu item
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(""); 
  const [currentStep, setCurrentStep] = useState(1);
  const [shipmentData, setShipmentData] = useState({
    source_pin: "",
    consignee_pin: "",
    weight: "",
    dimensions: "",
    shipmentdetails: { // Combined order and shipment details
      source_address: '',
      destination_address: '',
      district: '',
      pincode: '',
      primary_contact_name: '',
      primary_contact_mobile: '',
      primary_contact_email: '',
      secondary_contact_name: '', // Not required
      secondary_contact_mobile: '',
      secondary_contact_email: '',
      item_description: '',
      weight: '',
      dimensions: '',      
      courier_name: 'Delhiwery',
     
  },
    warehouse: {
      name: "",
      pin_code: "",
    },
    pickup: {
      client_warehouse: "",
      pickup_date: "",
      pickup_time: "",
      package_count: "",
    },
    manifest: {
      order_id: "",
      description: "",
    },
    createdShipment: null,
  });


  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleNotificationPopup = () => setNotificationPopupOpen((prev) => !prev);

  // Handle CSV file errors
  const handleError = (err) => {
    setError('Error reading CSV file');
    toast.error('Error reading CSV file');
    console.error(err);
  };


  const cleanRow = (row) => {
    const cleanedRow = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        // Clean the column names (remove spaces, quotes, special characters)
        const cleanedKey = key
          .trim()
          .replace("'", "")
          .replace('"', "")
          .replace(" ", "_")
          .toLowerCase(); // Make the key consistent (lowercase)
        cleanedRow[cleanedKey] = row[key];
      }
    }
    return cleanedRow;
  };
  
  const callAPI = async (endpoint, params) => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseURL}${endpoint}`, params);
      if (response.data.success) {
        toast.success(`${endpoint} executed successfully!`);
      } else {
        toast.error(`${endpoint} failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error calling ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  
  

  // Handle the CSV file loading
  const handleFileLoad = (data) => {
    const header = data[0]; // Get the header from the first row (keys)
    
    // Clean the header (replace spaces and unwanted characters)
    const cleanedHeader = header.map((item) => item.trim().replace("'", "").replace('"', "").replace(" ", "_"));
  
    // Map each subsequent row to an object, where the header values are the keys
    const cleanedData = data.slice(1).map((row) => {
      const cleanedRow = {};
      row.forEach((value, index) => {
        // Use the cleaned header to map the row values to the right keys
        cleanedRow[cleanedHeader[index]] = value;
      });
      return cleanedRow;
    });
  
    console.log("Cleaned Header:", cleanedHeader); // Log cleaned header
    console.log("Cleaned Data:", cleanedData); // Log cleaned data
  
    setCsvData(cleanedData);  // Store cleaned data
  };
  

  

  // Handle uploading CSV data and creating shipments/orders
  const handleUploadCSV = async () => {
    try {
        setLoading(true); 
      // Send CSV data to the backend to create shipments and orders
        const token = localStorage.getItem("access_token"); // or wherever you store the JWT
        const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        };

        const response = await axios.post(`${apiBaseURL}/upload-csv`, { data: csvData }, { headers });
        // Success response
        if (response.status === 200) {
            toast.success("CSV data processed successfully!");
            setError(null);  // Clear any previous error messages
        }
        console.log('CSV data processed:', response.data);
    } catch (err) {
        toast.error('Error uploading CSV');
      console.error(err);
    }finally {
        setLoading(false); // Hide the spinner after processing
      }
  };

  // Function to download the updated sample CSV
    const downloadSampleCSV = () => {
        const sampleCSV = [
            ["sr_no","source_address","destination_address","district","pincode","item_description","weight","dimensions","nember_of_items","order_date","courier_name","reference_number","awb","order_status","payment_status","shipment_status","current_location","estimated_delivery_date","primary_contact_name","primary_contact_number","primary_contact_email","secondary_contact_name","secondary_contact_number","secondary_contact_email"],
            ["1","123 Main St City A","456 Another St City B","Delhi","111111","Item A",10.5,"10x10x10",20,"12/12/2024","DVC","ABC12345","123545","Pending","Unpaid","In Trasit","01/12/2024","02/12/2024","Sunny Kashyap","9999999999","abc@test.com","John Doe","9876543210","john.doe@email.com"]
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + sampleCSV.map(row => row.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_orders_shipments_with_contacts.csv");
        document.body.appendChild(link);

        link.click();
    };


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
  const [messages, setMessages] = useState({});
  const steps = [
    { id: 1, name: "Shipment Details" },
    { id: 2, name: "Create Warehouse" },
    { id: 3, name: "Create Pickup" },
    { id: 4, name: "Manifest Order" },
    { id: 5, name: "Summary" },
  ];

  // Handle input changes
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
  
    setShipmentData((prevData) => {
      if (section) {
        // Handle nested fields (e.g., address or other nested properties)
        const keys = name.split("."); // Check if name contains nested keys (e.g., "address_details.address")
        if (keys.length > 1) {
          const [parent, child] = keys; // Split into parent and child
          return {
            ...prevData,
            [section]: {
              ...prevData[section],
              [parent]: {
                ...prevData[section][parent],
                [child]: value,
              },
            },
          };
        }
  
        // Handle non-nested fields
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [name]: value,
          },
        };
      }
  
      // Handle top-level fields
      return { ...prevData, [name]: value };
    });
  };
  
  // Handle API calls for each step
  const handleStepSubmit = async (step) => {
    try {
      setLoading(true);
      if (step === 1) {
        console.log("shipmentData>>", shipmentData);
        try {
          setLoading(true);
          let stepHasError = false;
          let newMessages = []; // Temporary array to hold messages for this step
      
          // Validate Shipment Details
          if (!shipmentData.source_pin || !shipmentData.consignee_pin || !shipmentData.weight || !shipmentData.dimensions) {
            newMessages.push("All fields are required.");
            stepHasError = true;
          }
      
          // Step 1: Check Serviceability
          const serviceabilityResponse = await axios.post(`${apiBaseURL}/api/check_serviceability`, {
            pincode: shipmentData.source_pin,
            weight: shipmentData.weight,
          });
          console.log("serviceabilityResponse.data:", serviceabilityResponse.data);
      
          if (!serviceabilityResponse.data.success) {
            newMessages.push("Serviceability check failed.");
            stepHasError = true;
          } else {
            newMessages.push("Serviceability check successful.");
          }
      
          // Step 2: Freight Estimation
          if (!stepHasError) {
            const freightDetails = {
              dimensions: JSON.parse(shipmentData.dimensions),
              weight_g: shipmentData.weight,
              source_pin: shipmentData.source_pin,
              consignee_pin: shipmentData.consignee_pin,
              payment_mode: "prepaid",
              inv_amount: "2000",
              rov_insurance:true,
            };
            const freightResponse = await axios.post(`${apiBaseURL}/api/freight_estimate`, freightDetails);
            console.log("freightResponse.data:", freightResponse.data);
      
            if (!freightResponse.data.success) {
              newMessages.push("Freight estimate check failed.");
              stepHasError = true;
            } else {
              newMessages.push("Freight estimate check successful.");
            }
          }
      
          // Update the messages state for this step
         
      
          // Navigate to the next step or stay on the current step
          if (stepHasError) {
            setCurrentStep(1);
            setMessages((prevMessages) => ({
              ...prevMessages,
              [step]: {
                type: "error",
                text: newMessages, // Store all messages for this step as an array
              },
            }));
          } else {
            setCurrentStep(2);
            setMessages((prevMessages) => ({
              ...prevMessages,
              [step+1]: {
                type: "success",
                text: newMessages, // Store all messages for this step as an array
              },
            }));
          }
        } catch (error) {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [step]: {
              type: "error",
              text: [`An error occurred: ${error.message}`],
            },
          }));
        } finally {
          setLoading(false);
        }
      }
       else if (step === 2) {
        // Create Warehouse API
        const response = await axios.post(`${apiBaseURL}/api/create_warehouse`, shipmentData.warehouse);
        if (response.data.success) {
          setMessages({ ...messages, [step]: { type: "success", text: response.data.message } });
          setCurrentStep(3);
        } else {
          setMessages({ ...messages, [step]: { type: "error", text: response.data.message } });
        }
      } else if (step === 3) {
        // Create Pickup API
          try {
            const shipmentDataSet = {
                pickupDetails: shipmentData.pickup,
                shipmentDetails: shipmentData.shipmentdetails
            };
            const token = localStorage.getItem("access_token"); // or wherever you store the JWT
            const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            };

            const response = await axios.post(`${apiBaseURL}/api/create_pickup`, shipmentDataSet, { headers });


            if (response.data.success) {
                setCurrentStep(4);
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [step]: { type: "success", text: "Shipment and Pickup created successfully." },
                }));
                
            } else {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [step]: { type: "error", text: response.data.message || "Failed to create pickup." },
                }));
            }
        } catch (error) {
            console.error("Error creating pickup:", error);
            setMessages((prevMessages) => ({
                ...prevMessages,
                [step]: { type: "error", text: "An error occurred while creating the pickup." },
            }));
        } finally {
            setLoading(false);
        }
        
      } else if (step === 4) {
        // Manifest Order API
        const response = await axios.post(`${apiBaseURL}/api/manifest_order`, shipmentData.manifest);
        if (response.data.success) {
          setMessages({ ...messages, [step]: { type: "success", text: response.data.message } });
          setCurrentStep(5);
        } else {
          setMessages({ ...messages, [step]: { type: "error", text: response.data.message } });
        }
      } else if (step === 5) {
        // Final Step: Create Shipment and Order
        const response = await axios.post(`${apiBaseURL}/api/create_shipment`, shipmentData);
        if (response.data.success) {
          setMessages({ ...messages, [step]: { type: "success", text: response.data.message } });
          setShipmentData({ ...shipmentData, createdShipment: response.data.shipment });
        } else {
          setMessages({ ...messages, [step]: { type: "error", text: response.data.message } });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages({ ...messages, [step]: { type: "error", text: "An error occurred while processing the request." } });
    } finally {
      setLoading(false);
    }
  };

  //ware house functions
  const [warehouseTab, setWarehouseTab] = useState("existing"); // Track the active tab (existing/new)
  const [warehouses, setWarehouses] = useState([]); // Store the list of existing warehouses
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // Store the selected warehouse details
  const [pickupDetails, setPickupDetails] = useState(null); // Stores the pickup details
  const [shipmentDetailResponce, setShipmentDetails] = useState(null); // Stores the pickup details
  const [orderDetailresponce, setOrderDetails] = useState(null); // Stores the pickup details

  const skipStep = () => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [1]: { type: "info", text: "Shipment details skipped." },
    }));
    setCurrentStep(2); // Move to Step 2
  };
  
  useEffect(() => {
    // Fetch existing warehouses from the API
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setError("User not logged in. Please log in again.");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const response = await axios.get(`${apiBaseURL}/warehouses`, { headers });
        
        console.log('response.data',response.data);
        if (response.data.success) {
          setWarehouses(response.data.warehouses);
        } else {
          toast.error("Failed to fetch warehouses.");
        }
      } catch (error) {
        toast.error("Error fetching warehouses.");
        console.error(error);
      }
    };
  
    fetchWarehouses();
  }, []);
  const createWarehouse = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token"); // or wherever you store the JWT
        const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        };

      //const response = await axios.post(`${apiBaseURL}/create_warehouse`, { data: csvData }, { headers });
      const response = await axios.post(`${apiBaseURL}/api/create_warehouse`, shipmentData.warehouse, { headers });
  
      if (response.data.success) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [2]: { type: "success", text: "Warehouse created successfully." },
        }));
        
        // Store warehouse details for Step 4
        setSelectedWarehouse({
          id: response.data.warehouse_id,
          name: response.data.warehouse_name,
        });
  
        setCurrentStep(3); // Move to Step 3 (Pickup Creation)
      } else {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [2]: { type: "error", text: response.data.message },
        }));
      }
    } catch (error) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [2]: { type: "error", text: `Error: ${error.message}` },
      }));
    } finally {
      setLoading(false);
    }
  };
  const cancelPickup = async () => {
    try {
      const response = await axios.post(`${apiBaseURL}/api/cancel_pickup`, { pickup_id: pickupDetails.id });
  
      if (response.data.success) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [3]: { type: "success", text: "Pickup canceled successfully." },
        }));
        setPickupDetails(null); // Clear pickup details
      } else {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [3]: { type: "error", text: response.data.message },
        }));
      }
    } catch (error) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [3]: { type: "error", text: `Error: ${error.message}` },
      }));
    }
  };

  const createPickup = async () => {
    try {
        setLoading(true);
        shipmentData.pickup.client_warehouse=selectedWarehouse.name;
        shipmentData.pickup.client_warehouse_id=selectedWarehouse.id;
        shipmentData.shipmentdetails.source_address=shipmentData.shipmentdetails.source_address || selectedWarehouse.address||"";
        shipmentData.shipmentdetails.weight= shipmentData.shipmentdetails.weight || shipmentData.weight;
        shipmentData.shipmentdetails.dimensions= shipmentData.shipmentdetails.dimensions || shipmentData.dimensions;
        
        const shipmentDataSet = {
          pickupdata: shipmentData.pickup,
          shipmentdata: shipmentData.shipmentdetails
        };
        const token = localStorage.getItem("access_token"); // or wherever you store the JWT
        const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        };
        console.log('shipmentDataSet',shipmentDataSet);
        const response = await axios.post(`${apiBaseURL}/api/create_pickup`, shipmentDataSet, { headers });
        console.log('response.data',response.data);
        if (response.data.success) {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [3]: { type: "success", text: "Pickup created successfully. Pickup Id : "+ response.data.pickup_id},
            }));
            setPickupDetails(response.data.pickup_result.pickup_data); // Assuming the API returns all details
            setShipmentDetails(response.data.shipment_result.shipment_data); 
            setOrderDetails(response.data.order_result.order_data); 
            setCurrentStep(4);
           
        } else {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [3]: { type: "error", text: response.data.message },
            }));
        }
    } catch (error) {
        setMessages((prevMessages) => ({
            ...prevMessages,
            [3]: { type: "error", text: `Error: ${error.message}` },
        }));
    } finally {
      setLoading(false);
    }
};
const handleManifest = async () => {
  // Construct the manifest data payload according to the API requirements.
  const manifestData = {
      lrn: "your_lrn_value", // Replace with actual value
      pickup_location_name: selectedWarehouse?.name,
      payment_mode: "prepaid", // or "cod"
      weight: parseFloat(shipmentData.weight) * 1000, // Convert kg to grams
      dropoff_location: shipmentData.shipmentdetails.destination_address,
      return_address: {
          name: "Your Name",
          address: "Your Return Address",
          city: "Your City",
          state: "Your State",
          zip: "Your Zip",
          phone: "Your Phone",
      },
      shipment_details: [
          {
              order_id: shipmentData.manifest.order_id,
              address: shipmentData.shipmentdetails.destination_address,
              city: shipmentData.shipmentdetails.district,
              state: "Your State", // Replace with State
              zip: shipmentData.shipmentdetails.pincode,
              phone: shipmentData.shipmentdetails.primary_contact_mobile,
              email: shipmentData.shipmentdetails.primary_contact_email,
              box_count: shipmentData.pickup.package_count,
              description: shipmentData.shipmentdetails.item_description,
              weight: parseFloat(shipmentData.weight) * 1000, // Convert kg to grams
              master: true,
          },
      ],
      dimensions: [
          {
              box_count: shipmentData.pickup.package_count,
              length: 10, //replace with your data.
              width: 10, //replace with your data.
              height: 10, //replace with your data.
          },
      ],
      freight_mode: "FOP", // or "FOD"
      billing_address: {
          name: "Your Billing Name",
          company: "Your Company",
          consignor: "Consignor Name",
          address: "Your Billing Address",
          city: "Your Billing City",
          state: "Your Billing State",
          pin: "Your Billing Pin",
          phone: "Your Billing Phone",
      },
      fm_pickup: true, // or false
  };

  try {
    const token = localStorage.getItem("access_token"); // or wherever you store the JWT
        const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        };
        const response = await axios.post(`${apiBaseURL}/api/manifest_order`, manifestData, { headers });
       

      const result = await response.json();
      console.log("Manifest result:", result);

      // Handle the response (e.g., show success message, error message)
  } catch (error) {
      console.error("Error manifesting order:", error);
      // Handle the error (e.g., show error message)
  }
};
  
  


  return (
    <div className="min-h-screen flex flex-col">
        {/* Full-page Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner-border animate-spin h-16 w-16 border-4 border-t-transparent border-white rounded-full"></div>
        </div>
      )}
      {/* Header Section */}
      <header className="bg-cover bg-center text-white min-h-[400px]" style={{ backgroundImage: `url(${headerImg})` }}>
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold">CargoJoy</div>
            {/* Menu Items */}
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
          <div className="flex items-center">
            <button onClick={toggleNotificationPopup} className="text-white hover:bg-gray-700 p-2 rounded-full mx-4">
              <span className="material-icons">notifications</span> 5
            </button>
            <button onClick={toggleDropdown} className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700">
              Profile
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                <a href="/change-password" className="block px-4 py-2 hover:bg-gray-100">Change Password</a>
              </div>
            )}
          </div>
        </div>

       
      </header>

      {/* Main Content Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 bg-[#FF8474] text-white p-0 flex flex-col">
            <button 
                onClick={() => setSelectedMenu('uploadShipment')}
                className={`text-white py-12 border-b transition-all duration-300 ease-in-out ${selectedMenu === 'uploadShipment' ? 'bg-gradient-to-r from-[#696880] to-[#ADADC9] text-[#FF8474] border-none font-bold text-xl' : 'bg-gradient-to-r from-[#FF8474] to-[#FFABA9] font-bold border-r-2 border-white'}`}>
                Upload Shipment
            </button>
            <button
              onClick={() => setSelectedMenu("utility")}
              className={`py-12 ${selectedMenu === "utility" ? "bg-[#ADADC9]" : "bg-[#FFABA9]"} text-xl`}
            >
              Utility APIs
            </button>
            <button 
                onClick={() => setSelectedMenu('uploadOrders')}
                className={`text-white py-12 border-b transition-all duration-300 ease-in-out ${selectedMenu === 'uploadOrders' ? 'bg-gradient-to-r from-[#696880] to-[#ADADC9] text-[#FF8474] border-none font-bold text-xl' : 'bg-gradient-to-r from-[#FF8474] to-[#FFABA9]  font-bold border-r-2 border-white'}`}>
                Upload Orders
            </button>
            <button 
                onClick={() => setSelectedMenu('manageWarehouse')}
                className={`text-white py-12 border-b transition-all duration-300 ease-in-out ${selectedMenu === 'manageWarehouse' ? 'bg-gradient-to-r from-[#696880] to-[#ADADC9] text-[#FF8474] border-none font-bold text-xl' : 'bg-gradient-to-r from-[#FF8474] to-[#FFABA9]  font-bold border-r-2 border-white'}`}>
                Manage Warehouse
            </button>
            <button 
                onClick={() => setSelectedMenu('manageProviders')}
                className={`text-white py-12 border-b transition-all duration-300 ease-in-out ${selectedMenu === 'manageProviders' ? 'bg-gradient-to-r from-[#696880] to-[#ADADC9] text-[#FF8474] border-none font-bold text-xl' : 'bg-gradient-to-r from-[#FF8474] to-[#FFABA9]   font-bold border-r-2 border-white'}`}>
                Manage Providers
            </button>
            </div>



        {/* Main Content Area */}
        <div className="w-5/6 bg-gradient-to-r from-[#696880] to-[#ADADC9]">
          {/* Display Content Based on Menu Selection */}
          {selectedMenu === 'uploadShipment' && (
            <div className="bg-gradient-to-r from-[#696880] to-[#ADADC9] pr-4 pl-4 pt-4">
             <div>
                {/* Add Parcel Flow */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-[#FF8474] mb-6">Add Shipment</h2>
                 {/* Progress Bar */}
            <div className="flex justify-between mb-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => (step.id <= currentStep ? setCurrentStep(step.id) : null)}
                  className={`cursor-pointer flex-1 text-center py-3 px-4 rounded-lg transition-all ${
                    currentStep > step.id
                      ? "bg-[#FF8474] text-white"
                      : currentStep === step.id
                      ? "bg-[#ADADC9] text-black"
                      : "bg-gray-300 text-black"
                  } hover:opacity-80`}
                >
                  {step.name}
                </div>
              ))}
            </div>

            {/* Messages */}
            {messages[currentStep] && Array.isArray(messages[currentStep].text) ? (
              <div
                className={`p-3 mb-4 rounded ${
                  messages[currentStep].type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messages[currentStep].text.map((msg, index) => (
                  <p key={index} className="mb-1">
                    {msg}
                  </p>
                ))}
              </div>
            ) : (
              messages[currentStep] && (
                <div
                  className={`p-3 mb-4 rounded ${
                    messages[currentStep].type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {messages[currentStep].text}
                </div>
              )
            )}

            {/* Step Content */}
            {currentStep === 1 && (
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Pincode</label>
                  <input
                    type="text"
                    name="source_pin"
                    value={shipmentData.source_pin}
                    onChange={(e) => handleInputChange(e)}
                    className="block w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consignee Pincode</label>
                  <input
                    type="text"
                    name="consignee_pin"
                    value={shipmentData.consignee_pin}
                    onChange={(e) => handleInputChange(e)}
                    className="block w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                    <input
                      type="text"
                      name="weight"
                      value={shipmentData.weight}
                      onChange={handleInputChange}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (JSON)</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={shipmentData.dimensions}
                      onChange={handleInputChange}
                      placeholder='[{"length":10,"width":5,"height":15,"box_count":1}]'
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button disabled className="bg-gray-300 text-white px-4 py-2 rounded-lg">Previous</button>

                    {/* Buttons Container with Spacing */}
                    <div className="flex justify-between mt-6 space-x-4">
                      <button
                        type="button"
                        onClick={skipStep}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Skip
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStepSubmit(1)}
                        className="bg-[#FF8474] text-white px-4 py-2 rounded-lg hover:bg-[#FFABA9]"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                
              </form>
            )}

            {/* Step 2 */}
            {/* Step 2 */}
            {currentStep === 2 && (
              <div>
                {/* Tab Selection for Existing or New Warehouse */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setWarehouseTab("existing")}
                    className={`px-6 py-3 rounded-lg ${
                      warehouseTab === "existing" ? "bg-[#FF8474] text-white" : "bg-gray-300 text-black"
                    }`}
                  >
                    Select Existing Warehouse
                  </button>
                  <button
                    onClick={() => setWarehouseTab("new")}
                    className={`px-6 py-3 rounded-lg ${
                      warehouseTab === "new" ? "bg-[#FF8474] text-white" : "bg-gray-300 text-black"
                    }`}
                  >
                    Add New Warehouse
                  </button>
                </div>

            {/* Existing Warehouse Tab */}
            {warehouseTab === "existing" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Select an Existing Warehouse</h3>
                <div className="grid grid-cols-1 gap-4">
                  {warehouses.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="border p-4 rounded-lg hover:shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setMessages({ ...messages, [2]: { type: "success", text: `Selected ${warehouse.name}.` } });
                        setCurrentStep(3);
                      }}
                    >
                      <p><strong>Name:</strong> {warehouse.name}</p>
                      <p><strong>Pincode:</strong> {warehouse.pin_code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Warehouse Tab */}
            {warehouseTab === "new" && (
              <form>
                <h3 className="text-lg font-semibold mb-4">Warehouse Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Required Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={shipmentData.warehouse.name}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                    <input
                      type="text"
                      name="pin_code"
                      value={shipmentData.warehouse.pin_code}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shipmentData.warehouse.city || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shipmentData.warehouse.state || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shipmentData.warehouse.country || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Address Details */}
                <h4 className="text-lg font-semibold mt-6 mb-4">Address Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                    <textarea
                      name="address_details.address"
                      value={shipmentData.warehouse.address_details?.address || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      name="address_details.contact_person"
                      value={shipmentData.warehouse.address_details?.contact_person || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                      type="text"
                      name="address_details.phone_number"
                      value={shipmentData.warehouse.address_details?.phone_number || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="address_details.email"
                      value={shipmentData.warehouse.address_details?.email || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                 {/* Return Address Details */}
                <h4 className="text-lg font-semibold mt-6 mb-4">Return Address Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Address*</label>
                    <textarea
                      name="ret_address.address"
                      value={shipmentData.warehouse.ret_address?.address || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Address Pincode*</label>
                    <input
                      type="text"
                      name="ret_address.pin"
                      value={shipmentData.warehouse.ret_address?.pin || ""}
                      onChange={(e) => handleInputChange(e, "warehouse")}
                      className="block w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                {/* Optional Fields */}
              <h4 className="text-lg font-semibold mt-6 mb-4">Additional Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
                  <input
                    type="text"
                    name="tin_number"
                    value={shipmentData.warehouse.tin_number || ""}
                    onChange={(e) => handleInputChange(e, "warehouse")}
                    className="block w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CST Number</label>
                  <input
                    type="text"
                    name="cst_number"
                    value={shipmentData.warehouse.cst_number || ""}
                    onChange={(e) => handleInputChange(e, "warehouse")}
                    className="block w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Type</label>
                  <input
                    type="text"
                    name="warehouse_type"
                    value={shipmentData.warehouse.warehouse_type || ""}
                    onChange={(e) => handleInputChange(e, "warehouse")}
                    className="block w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QR Enabled</label>
                  <select
                    name="qr_enabled"
                    value={shipmentData.warehouse.qr_enabled || "false"}
                    onChange={(e) => handleInputChange(e, "warehouse")}
                    className="block w-full p-2 border rounded-lg"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={createWarehouse}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg ${
                      loading
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-[#FF8474] text-white hover:bg-[#FFABA9]"
                    }`}
                  >
                    {loading ? "Creating..." : "Create Warehouse"}
                  </button>
                </div>
              </form>
            )}

          
            </div>
            )}
            

            {/* Step 3 */}
            {currentStep === 3 && (
              <div>
                {/* Display Selected Warehouse Info */}
                {selectedWarehouse && (
                  <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-lg">
                    <h4 className="text-lg font-semibold">Selected Warehouse</h4>
                    <p><strong>Name:</strong> {selectedWarehouse.name}</p>
                    <p><strong>ID:</strong> {selectedWarehouse.id}</p>
                    <p><strong>Address:</strong> {selectedWarehouse.address}</p>
                  </div>
                )}
                

                {/* Create Pickup Form */}
               
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await createPickup();
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">Shipment Details</h3> {/* Combined Section Title */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(shipmentData.shipmentdetails).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                                {key === 'secondary_contact_name' || key === 'secondary_contact_mobile' || key === 'secondary_contact_email' ? '' : '*'}
                            </label>
                            {key.includes("address") ? (
                                <textarea
                                    name={key}
                                    value={key.includes("source_address") ? selectedWarehouse?.address || shipmentData.shipmentdetails[key] || "" : shipmentData.shipmentdetails[key] || ""} // Correct value with selectedWarehouse check
                                    onChange={(e) => handleInputChange(e, "shipmentdetails")} // Correct onChange
                                    className={`block w-full p-2 border rounded-lg ${key.includes("source_address") ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                    required={!key.includes("secondary")}
                                    readOnly={key.includes("source_address")}
                                />
                            ) : (
                                <input
                                    type={key.includes("date") ? "date" : key.includes("weight") ? "number" : key.includes("dimensions") ? "text" : key.includes("number") ? "number" : "text"} // Correct type handling
                                    name={key}
                                    value={key.includes("dimensions") ? shipmentData.dimensions : key.includes("weight") ? shipmentData.weight ||"" : shipmentData.shipmentdetails[key] || ""}  // Correct value for dimensions and weight
                                    onChange={(e) => handleInputChange(e, "shipmentdetails")}  // Correct onChange
                                    className={`block w-full p-2 border rounded-lg}`}
                                    required={!key.includes("secondary")}
                                    readOnly={key.includes("source_address")}
                                />
                            )}
                        </div>
                    ))}
                </div>
                  <h3 className="text-lg font-semibold mb-4">Create Pickup</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Client Warehouse */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Warehouse*</label>
                      <input
                        type="text"
                        name="client_warehouse"
                        value={selectedWarehouse.name || ""}
                        readOnly
                        className="block w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Pickup Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date*</label>
                      <input
                        type="date"
                        name="pickup_date"
                        value={shipmentData.pickup.pickup_date || ""}
                        onChange={(e) => handleInputChange(e, "pickup")}
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                      <input
                        type="time"
                        name="pickup_time"
                        value={shipmentData.pickup.pickup_time || ""}
                        onChange={(e) => handleInputChange(e, "pickup")}
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>

                    {/* Package Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package Count*</label>
                      <input
                        type="number"
                        name="package_count"
                        value={shipmentData.pickup.package_count || ""}
                        onChange={(e) => handleInputChange(e, "pickup")}
                        className="block w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="bg-[#FF8474] text-white px-4 py-2 rounded-lg hover:bg-[#FFABA9]"
                    >
                      Create Pickup
                    </button>
                  </div>
                </form>

                {/* Cancel Pickup Button */}
                {pickupDetails && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Cancel Pickup</h4>
                    <button
                      onClick={cancelPickup}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                    >
                      Cancel Pickup
                    </button>
                  </div>
                )}

                {/* Error or Success Messages */}
                {messages[3] && (
                  <div
                    className={`p-3 mt-4 rounded ${
                      messages[3].type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {messages[3].text}
                  </div>
                )}
              </div>
            )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <form>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <p><strong>Order ID:</strong> {orderDetailresponce.id}</p>
                <p><strong>Source Address:</strong> {orderDetailresponce.source_address}</p>
                <p><strong>Destination Address:</strong> {orderDetailresponce.destination_address}</p>
                <p><strong>Item Description:</strong> {orderDetailresponce.item_description}</p>
                <p><strong>Weight:</strong> {orderDetailresponce.weight}</p>
                <p><strong>Dimensions:</strong> {orderDetailresponce.dimensions}</p>
                {/* Add other relevant order details */}
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Shipment Details</h2>
                <p><strong>Tracking ID:</strong> {shipmentDetailResponce.tracking_id}</p>
                <p><strong>Courier Name:</strong> {shipmentDetailResponce.courier_name}</p>
                <p><strong>Shipment Status:</strong> {shipmentDetailResponce.shipment_status}</p>
                {/* Add other relevant shipment details */}
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Warehouse Details</h2>
                <p><strong>Warehouse Name:</strong> {selectedWarehouse?.name}</p>
                <p><strong>Warehouse Address:</strong> {selectedWarehouse?.address}</p>
                <p><strong>Contact Person:</strong> {selectedWarehouse?.contact_person}</p>
                <p><strong>Contact Phone:</strong> {selectedWarehouse?.phone_number}</p>
                {/* Add other relevant warehouse details */}
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Pickup Details</h2>
                <p><strong>Pickup Date:</strong> {pickupDetails.pickup_date}</p>
                <p><strong>Pickup Time:</strong> {pickupDetails.pickup_time}</p>
                <p><strong>Pickup Location:</strong> {selectedWarehouse?.address}</p>
                <p><strong>Package Count:</strong> {pickupDetails.package_count}</p>
                <p><strong>Package Id:</strong> {pickupDetails.external_pickup_id}</p>
                {/* Add other relevant pickup details */}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handleManifest()} // Call handleManifest function
                  className="bg-[#FF8474] text-white px-4 py-2 rounded-lg hover:bg-[#FFABA9]"
                >
                  Manifest Order
                </button>
              </div>
            </form>
          )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <p>Shipment ID: {shipmentData.createdShipment?.id || "N/A"}</p>
                <p>Tracking ID: {shipmentData.createdShipment?.tracking_id || "N/A"}</p>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("Process Completed!")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Finish
                  </button>
                </div>
              </div>
            )}
                
               
              </div>
            </div>
                {/* Success or Error Message */}
                {successMessage && (
                    <div className="bg-green-500 text-white text-center py-3">{successMessage}</div>
                )}
                {error && (
                    <div className="bg-red-500 text-white text-center py-3">{error}</div>
                )}
              {/* CSV File Upload */}
             <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                 <h2 className="text-xl font-semibold mb-4 text-[#FF8474]">Upload CSV</h2>
                
                 <CSVReader onFileLoaded={handleFileLoad} onError={handleError} config={{ header: true }}/>
                {/* Add the link for downloading the sample CSV */}
                <a 
                    href="#"
                    onClick={downloadSampleCSV}
                    className="text-[#FF8474] underline mt-4 block">
                    Download Sample CSV
                </a>
           
             </div>
     
             {/* CSV Data Preview */ }
             {csvData.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto">
                    <div className="bg-gradient-to-r from-[#FF8474] to-[#FFABA9] text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div className="text-lg">CSV Preview</div>

                    {/* View Shipment button in the header */}
                    <button
                        onClick={handleUploadCSV}
                        className="bg-gradient-to-r from-[#696880] to-[#ADADC9] border text-white px-4 py-2 rounded-lg hover:bg-gray-600" disabled={loading} 
                    >
                      Upload CSV and Create Shipments
                    </button> 
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-[#FF8474] text-white">
                            <th className="py-2 px-4 border">Sr No</th>
                            <th className="py-2 px-4 border">source_address</th>                        
                            <th className="py-2 px-4 border">destination_address</th>
                            <th className="py-2 px-4 border">City</th>
                            <th className="py-2 px-4 border">Pincode</th>                        
                            <th className="py-2 px-4 border">Item Description</th>                        
                            <th className="py-2 px-4 border">weight</th>      
                            <th className="py-2 px-4 border">dimensions</th> 
                            <th className="py-2 px-4 border">nember_of_items</th>                        
                            <th className="py-2 px-4 border">Date</th>
                            <th className="py-2 px-4 border">Courier</th>
                            <th className="py-2 px-4 border">Ref</th>
                            <th className="py-2 px-4 border">AWB</th>
                            <th className="py-2 px-4 border">Oders Status</th>
                            <th className="py-2 px-4 border">Payment Status</th>
                            <th className="py-2 px-4 border">shipment_status</th>
                            <th className="py-2 px-4 border">current_location</th>
                            <th className="py-2 px-4 border">estimated_delivery_date</th>                        
                            <th className="py-2 px-4 border">Primary Contact Name</th>
                            <th className="py-2 px-4 border">Primary Contact Number</th>
                            <th className="py-2 px-4 border">Primary Contact Email</th>
                            <th className="py-2 px-4 border">Secondary Contact Name</th>
                            <th className="py-2 px-4 border">Secondary Contact Number</th>
                            <th className="py-2 px-4 border">Secondary Contact Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, index) => {
                            // Skip the first row if needed (header is included in the data)
                            //if (index === 0) return null;

                            return (
                                <tr key={index}>
                                <td className="py-2 px-4 border">{row.sr_no}</td>
                                <td className="py-2 px-4 border">{row.source_address}</td>                          
                                <td className="py-2 px-4 border">{row.destination_address}</td>
                                <td className="py-2 px-4 border">{row.district}</td>
                                <td className="py-2 px-4 border">{row.pincode}</td>
                                <td className="py-2 px-4 border">{row.item_description}</td>
                                <td className="py-2 px-4 border">{row.weight}</td>
                                <td className="py-2 px-4 border">{row.dimensions}</td>
                                <td className="py-2 px-4 border">{row.nember_of_items}</td>
                                <td className="py-2 px-4 border">{row.order_date}</td>
                                <td className="py-2 px-4 border">{row.courier_name}</td>
                                <td className="py-2 px-4 border">{row.reference_number}</td>
                                <td className="py-2 px-4 border">{row.awb}</td>
                                <td className="py-2 px-4 border">{row.order_status}</td>
                                <td className="py-2 px-4 border">{row.payment_status}</td>
                                <td className="py-2 px-4 border">{row.shipment_status}</td>
                                <td className="py-2 px-4 border">{row.current_location}</td>
                                <td className="py-2 px-4 border">{row.estimated_delivery_date}</td>
                                <td className="py-2 px-4 border">{row.primary_contact_name}</td>
                                <td className="py-2 px-4 border">{row.primary_contact_number}</td>
                                <td className="py-2 px-4 border">{row.primary_contact_email}</td>
                                <td className="py-2 px-4 border">{row.secondary_contact_name}</td>
                                <td className="py-2 px-4 border">{row.secondary_contact_number}</td>
                                <td className="py-2 px-4 border">{row.secondary_contact_email}</td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>
                </div>
                )}


          
             </div>
          )}

          {selectedMenu === "utility" && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#FF8474]">Utility APIs</h2>
              
              {/* Provider Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Provider</label>
                <select
                  onChange={(e) => setProvider(e.target.value)}
                  className="block w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8474]"
                >
                  <option value="">Select a Provider</option>
                  <option value="provider1">Provider 1</option>
                  <option value="provider2">Provider 2</option>
                  <option value="provider3">Provider 3</option>
                </select>
              </div>

              {/* API Interaction Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apis.map((api, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow">
                    <h3 className="text-lg font-semibold text-[#696880] mb-4">{api.name}</h3>
                    
                    {/* Dynamic Parameter Inputs */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const params = {};
                        api.params.forEach((param) => {
                          params[param] = e.target[param].value;
                        });
                        callAPI(api.endpoint, params);
                      }}
                    >
                      {api.params.map((param, idx) => (
                        <div key={idx} className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">{param}</label>
                          <input
                            type="text"
                            name={param}
                            placeholder={`Enter ${param}`}
                            className="block w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8474]"
                            required
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        className="w-full bg-[#FF8474] text-white px-4 py-2 rounded-lg hover:bg-[#FFABA9] transition-all"
                      >
                        Call {api.name}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
       

          {selectedMenu === 'manageWarehouse' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#FF8474]">Manage Warehouse</h2>
              <p>Manage Warehouse Content will go here.</p>
            </div>
          )}

          {selectedMenu === 'manageProviders' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#FF8474]">Manage Providers</h2>
              <p>Manage Providers Content will go here.</p>
            </div>
          )}
        </div>
      </div>
       {/* Toast Container for success/error messages */}
       <ToastContainer />

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

export default AdminPage;
