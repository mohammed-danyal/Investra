import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import PortfolioContext from "../../context/PortfolioContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, action }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const generalContext = useContext(GeneralContext);
  const { placeOrder } = useContext(PortfolioContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSell = action === "SELL";

  const handleActionClick = async () => {
    setIsSubmitting(true);
    try {
      await placeOrder({
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: action || "BUY",
      });
      generalContext.closeBuyWindow();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order.");
      generalContext.closeBuyWindow();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="buy-action-window-container" id="buy-window" draggable="true">
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
            onClick={isSubmitting ? null : handleActionClick}
            style={{ 
              backgroundColor: isSell ? "#ff5722" : "#4184f3",
              color: "#fff",
              opacity: isSubmitting ? 0.7 : 1,
              pointerEvents: isSubmitting ? "none" : "auto"
            }}
          >
            {isSubmitting ? "Processing..." : (isSell ? "Sell" : "Buy")}
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
