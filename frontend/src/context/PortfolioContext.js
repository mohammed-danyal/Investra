import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import AuthContext from "./AuthContext";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState({ balance: 100000, usedMargin: 0, availableMargin: 100000 });
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [holdingsRes, positionsRes, ordersRes, fundsRes] = await Promise.all([
        api.get("/portfolio/holdings").catch(() => ({ data: { data: [] } })),
        api.get("/portfolio/positions").catch(() => ({ data: { data: [] } })),
        api.get("/portfolio/orders").catch(() => ({ data: { data: [] } })),
        api.get("/portfolio/funds").catch(() => ({ data: { data: { balance: 100000, usedMargin: 0, availableMargin: 100000 } } }))
      ]);
      setHoldings(holdingsRes.data.data || []);
      setPositions(positionsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setFunds(fundsRes.data.data || { balance: 100000, usedMargin: 0, availableMargin: 100000 });
    } catch (err) {
      console.error("Failed to fetch portfolio data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const placeOrder = async (orderData) => {
    try {
      await api.post("/portfolio/newOrder", orderData);
      await fetchPortfolio(); // Refresh data reactively without reload
    } catch (err) {
      console.error("Failed to place order", err);
      throw err;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await api.delete(`/portfolio/order/${orderId}`);
      await fetchPortfolio(); // Refresh data reactively without reload
    } catch (err) {
      console.error("Failed to delete order", err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{ holdings, positions, orders, funds, loading, fetchPortfolio, placeOrder, deleteOrder }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
