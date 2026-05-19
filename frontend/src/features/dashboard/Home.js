import React from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import "./dashboard.scss";

const Home = () => {
  return (
    <div className="dashboard-app-scope">
      <TopBar />
      <Dashboard />
    </div>
  );
};

export default Home;
