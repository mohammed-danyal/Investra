import React, { useContext } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import AuthContext from "../../context/AuthContext";
import PortfolioContext from "../../context/PortfolioContext";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = [
  "rgba(65, 132, 243, 0.8)",
  "rgba(72, 194, 55, 0.8)",
  "rgba(250, 118, 78, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(255, 159, 64, 0.8)",
];

const Summary = () => {
  const { user } = useContext(AuthContext);
  const { holdings, orders, funds } = useContext(PortfolioContext);
  const username = user?.name || "User";

  // Calculations
  const totalInvestment = holdings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = holdings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : 0;
  const pnlClass = pnl >= 0 ? "profit" : "loss";

  const formatK = (val) => {
    if (Math.abs(val) >= 1000) return (val / 1000).toFixed(2) + "k";
    return Math.abs(val) < 0.01 ? "0.00" : val.toFixed(2);
  };

  // 1. Dynamic Equity Curve Line Chart
  const baseValue = totalInvestment > 0 ? totalInvestment : 100000;
  const currentValueVal = totalInvestment > 0 ? currentValue : 103740;
  const step = (currentValueVal - baseValue) / 3;
  
  // Seed stable pseudorandom points based on total values so they don't fluctuate wildy on hover
  const midPoint1 = baseValue + step * 0.4 + (baseValue * 0.02);
  const midPoint2 = baseValue + step * 0.75 - (baseValue * 0.01);

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Portfolio Value (₹)",
        data: [baseValue, midPoint1, midPoint2, currentValueVal],
        borderColor: "#4184f3",
        backgroundColor: "rgba(65, 132, 243, 0.06)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#4184f3",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Value: ₹${parseFloat(ctx.parsed.y).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f3f3f3" },
        ticks: {
          callback: (value) => "₹" + formatK(value),
        },
      },
    },
  };

  // 2. Real Allocation vs Nifty Fallback Allocation
  const hasHoldings = holdings.length > 0;

  const allocationData = {
    labels: hasHoldings ? holdings.map((s) => s.name) : ["RELIANCE", "TCS", "INFY", "HUL", "ONGC", "Others"],
    datasets: [
      {
        label: hasHoldings ? "Portfolio Value (₹)" : "Weight (%)",
        data: hasHoldings 
          ? holdings.map((s) => (s.price * s.qty).toFixed(2)) 
          : [12, 10, 8, 7, 5, 58],
        backgroundColor: COLORS,
        borderColor: COLORS.map((c) => c.replace("0.8", "1")),
        borderWidth: 1.5,
      },
    ],
  };

  const allocationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          font: { size: 10, family: "sans-serif" },
          padding: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + parseFloat(b), 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            const prefix = hasHoldings ? "₹" : "";
            const val = parseFloat(ctx.parsed).toLocaleString("en-IN");
            return ` ${ctx.label}: ${prefix}${val} (${pct}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="summary-container-wrapper">
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="summary-grid">
        {/* Left Side: Stats Cards */}
        <div className="summary-left">
          <div className="section">
            <span><p>Equity</p></span>
            <div className="data" style={{ width: "100%" }}>
              <div className="first">
                <h3>{formatK(funds.balance)}</h3>
                <p>Margin available</p>
              </div>
              <hr />
              <div className="second">
                <p>Margins used <span>{formatK(funds.usedMargin)}</span></p>
                <p>Opening balance <span>100k</span></p>
              </div>
            </div>
            <hr className="divider" />
          </div>

          <div className="section">
            <span><p>Holdings ({holdings.length})</p></span>
            <div className="data" style={{ width: "100%" }}>
              <div className="first">
                <h3 className={pnlClass}>
                  {pnl >= 0 ? "+" : ""}{formatK(pnl)}{" "}
                  <small style={{ fontSize: "0.8rem", marginLeft: "4px" }}>
                    {pnl >= 0 ? "+" : ""}{pnlPercent}%
                  </small>
                </h3>
                <p>P&amp;L</p>
              </div>
              <hr />
              <div className="second">
                <p>Current Value <span>₹{formatK(currentValue)}</span></p>
                <p>Investment <span>₹{formatK(totalInvestment)}</span></p>
              </div>
            </div>
            <hr className="divider" />
          </div>

          <div className="section">
            <span><p>Orders ({orders.length})</p></span>
            <div className="data" style={{ width: "100%" }}>
              <div className="second">
                <p>Orders placed <span>{orders.length}</span></p>
              </div>
            </div>
            <hr className="divider" />
          </div>
        </div>

        {/* Right Side: Charts Cards */}
        <div className="summary-right">
          {/* Chart 1: Equity Curve */}
          <div className="chart-card">
            <div className="chart-card-title">
              {hasHoldings ? "Portfolio Performance" : "Simulated Performance (Demo)"}
            </div>
            <div style={{ height: "180px", position: "relative" }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          {/* Chart 2: Allocation */}
          <div className="chart-card">
            <div className="chart-card-title">
              {hasHoldings ? "Portfolio Allocation" : "Nifty 50 Top Stock Weightage"}
            </div>
            <div style={{ height: "180px", position: "relative" }}>
              <Doughnut data={allocationData} options={allocationOptions} />
            </div>
            {!hasHoldings && (
              <p style={{ fontSize: "0.75rem", color: "#aaa", textAlign: "center", marginTop: "12px", marginStyle: "italic" }}>
                *Start buying stocks to see your real portfolio allocation chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
