import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, action }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const generalContext = useContext(GeneralContext);
  const isSell = action === "SELL";

  const handleActionClick = () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
    axios
      .post(`${API_URL}/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: action || "BUY",
      })
      .then((res) => {
        // Successfully placed order
        generalContext.closeBuyWindow();
        window.location.reload(); // Quick refresh to show new order
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Failed to place order.");
        generalContext.closeBuyWindow();
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link 
            className="btn" 
            onClick={handleActionClick}
            style={{ 
              backgroundColor: isSell ? "#ff5722" : "#4184f3",
              color: "#fff"
            }}
          >
            {isSell ? "Sell" : "Buy"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;

