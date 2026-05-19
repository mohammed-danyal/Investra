import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Landingpage/Navbar";
import Footer from "../Landingpage/Footer";

const LandingLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingLayout;
