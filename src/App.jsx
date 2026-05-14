import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ServiceProviders from "./pages/manager/ServiceProviders";
import Settings from "./pages/manager/Settings";


import SPDashboard from "./pages/sp/SPDashboard";
import SPServices from "./pages/sp/SPServices";
import SPBookings from "./pages/sp/SPBookings";
import SPComplaints from "./pages/sp/SPComplaints";
import SPRatings from "./pages/sp/SPRatings";
import SPProfile from "./pages/sp/SPProfile";
import Shifts from "./pages/sp/shifts";
import Routine from "./pages/sp/routine";


import UserDashboard from "./pages/user/UserDashboard";
import UserLayout from "./layouts/UserLayout";
import UserServices from "./pages/user/UserServices";
import Slots from "./pages/user/Slots";
import MyBookings from "./pages/user/MyBookings";
import UserProfile from "./pages/user/UserProfile";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* MANAGER */}
        <Route path="/manager/dashboard" element={ <ProtectedRoute role="manager"> <ManagerDashboard /> </ProtectedRoute> }/>
        <Route path="/manager/providers" element={<ServiceProviders />} />
        <Route path="/manager/settings" element={<Settings />} />

        {/* SERVICE PROVIDER */}
        <Route path="/sp/dashboard" element={<SPDashboard />} />
        <Route path="/sp/services" element={<SPServices />} />
        <Route path="/sp/bookings" element={<SPBookings />} />
        <Route path="/sp/shifts" element={<Shifts />} />
        <Route path="/sp/routine" element={<Routine />} />
        <Route path="/sp/complaints" element={<SPComplaints />} />
        <Route path="/sp/ratings" element={<SPRatings />} />
        <Route path="/sp/profile" element={<SPProfile />} />

        {/* USER */}
        <Route path="/user/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
        <Route path="/services" element={<UserLayout><UserServices /></UserLayout>} />
        <Route path="/slots/:id" element={<UserLayout><Slots /></UserLayout>} />
        <Route path="/my-bookings" element={ <UserLayout><MyBookings /></UserLayout>} />
        {/* <Route path="/service/:id" element={<ServiceDetail />} /> */}
        <Route path="/user/profile" element={<UserProfile />} />

      </Routes>

    </Router>
  );
};

export default App;