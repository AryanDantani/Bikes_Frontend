import React from "react";
import BarChart from "../Dashboad-charts/Bar-Chart/BarChart";
import "./dashboard.scss";
import BarChart2 from "../Dashboad-charts/PI-Chart/PieChart";
import CandlestickChart from "../Dashboad-charts/Candlestick-Chart/CandleStickChart";

const Dashboard = () => {
  return (
    <div className="dashboard-main">
      <div className="dashboard-bg">
        <BarChart />
        <BarChart2/>
        <CandlestickChart/>
      </div>
    </div>
  );
};

export default Dashboard;
