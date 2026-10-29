import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalProfit: 0,
    itemsSold: 0,
    numberOfBills: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const productsRes = await axios.get(
        "http://localhost:5000/api/products"
      );

      const summaryRes = await axios.get(
        "http://localhost:5000/api/sales/summary/today"
      );

      setProducts(productsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.log("Dashboard error:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>DukaanMitra Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Today's Sales</h3>
          <p>₹{summary.totalSales || 0}</p>
        </div>

        <div className="card">
          <h3>Today's Profit</h3>
          <p>₹{summary.totalProfit || 0}</p>
        </div>

        <div className="card">
          <h3>Items Sold</h3>
          <p>{summary.itemsSold || 0}</p>
        </div>

        <div className="card">
          <h3>Total Bills</h3>
          <p>{summary.numberOfBills || 0}</p>
        </div>

        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Current Stock</h2>

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <h3>{product.name}</h3>
                <p>Stock: {product.stock}</p>
                <p>Selling Price: ₹{product.sellingPrice}</p>
                <p>
                  Stock Value: ₹
                  {product.stock * product.purchasePrice}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;