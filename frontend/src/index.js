import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";

import LandingLayout from "./layouts/LandingLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Homepage from "./Landingpage/home/Homepage";
import Signup from "./Landingpage/signup/signup";
import Login from "./Landingpage/Login/Login";
import Aboutpage from "./Landingpage/about/Aboutpage";
import Productpage from "./Landingpage/products/Productpage";
import Pricingpage from "./Landingpage/pricing/Pricingpage";
import Supportportal from "./Landingpage/support/Supportportal";
import NotFound from "./Landingpage/NotFound";

import DashboardHome from "./features/dashboard/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <PortfolioProvider>
        <Routes>
          {/* Landing Page Routes */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/product" element={<Productpage />} />
            <Route path="/pricing" element={<Pricingpage />} />
            <Route path="/support" element={<Supportportal />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardHome />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  </BrowserRouter>
);