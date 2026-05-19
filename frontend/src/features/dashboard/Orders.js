import React, { useContext } from "react";
import PortfolioContext from "../../context/PortfolioContext";

const Orders = () => {
  const { orders: allOrders, loading, deleteOrder } = useContext(PortfolioContext);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete order.");
    }
  };

  if (loading) {
    return (
      <div className="orders">
        <div className="no-orders"><p>Loading orders...</p></div>
      </div>
    );
  }

  if (!allOrders || allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.name}</td>
                <td className={order.mode === "BUY" ? "profit" : "loss"}>
                  {order.mode}
                </td>
                <td>{order.qty}</td>
                <td>
                  {order.price > 0
                    ? `₹${Number(order.price).toFixed(2)}`
                    : "Market"}
                </td>
                <td className="profit">Executed</td>
                <td>
                  <button
                    onClick={() => handleDelete(order._id)}
                    style={{
                      background: "#ff5722",
                      color: "#fff",
                      border: "none",
                      borderRadius: "3px",
                      padding: "3px 8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    ✕ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
