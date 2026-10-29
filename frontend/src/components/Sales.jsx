import React, { useState, useEffect } from "react";
import axios from "axios";

function Sales() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sales, setSales] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.log("Products error:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales");
      setSales(response.data);
    } catch (error) {
      console.log("Sales error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const sellProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/sales",
        {
          productName: productName,
          quantity: Number(quantity),
        }
      );

      alert(
        `Sale successful!\nRemaining Stock: ${response.data.remainingStock}`
      );

      setProductName("");
      setQuantity("");

      fetchProducts();
      fetchSales();
    } catch (error) {
      console.log("Sale error:", error);

      alert(
        error.response?.data?.message ||
          "Product sell nahi hua."
      );
    }
  };

  return (
    <div className="sales">
      <h1>Sales Management</h1>

      <div className="inventory-form">
        <h2>Sell Product</h2>

        <form onSubmit={sellProduct}>
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product._id} value={product.name}>
                {product.name} - Stock: {product.stock}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <button type="submit">
            Sell Product
          </button>
        </form>
      </div>

      <div className="inventory-list">
        <h2>Recent Sales</h2>

        {sales.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          sales.map((sale) => (
            <div className="product-card" key={sale._id}>
              <h3>{sale.productName}</h3>
              <p>Quantity Sold: {sale.quantity}</p>
              <p>Total Amount: ₹{sale.totalAmount}</p>
              <p>Profit: ₹{sale.profit}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sales;