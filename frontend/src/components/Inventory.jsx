import React, { useState, useEffect } from "react";
import axios from "axios";

function Inventory() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");
  const [autoImage, setAutoImage] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.log("Products error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Product name se automatic image find
  const findProductImage = async (productName) => {
    if (!productName.trim()) {
      setAutoImage("");
      return;
    }

    try {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          productName
        )}`
      );

      if (response.data.products.length > 0) {
        const product = response.data.products[0];

        setAutoImage(
          product.thumbnail || product.images?.[0] || ""
        );
      } else {
        setAutoImage("");
      }
    } catch (error) {
      console.log("Automatic image error:", error);
      setAutoImage("");
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      // Manual image available hai to manual image use hogi
      // warna automatic image use hogi
      const finalImage = image.trim() || autoImage;

      await axios.post(
        "http://localhost:5000/api/products",
        {
          name,
          purchasePrice: Number(purchasePrice),
          sellingPrice: Number(sellingPrice),
          stock: Number(stock),
          image: finalImage,
        }
      );

      // Form clear
      setName("");
      setPurchasePrice("");
      setSellingPrice("");
      setStock("");
      setImage("");
      setAutoImage("");

      fetchProducts();

      alert("Product added successfully!");
    } catch (error) {
      console.log("Add product error:", error);

      alert(
        error.response?.data?.message ||
          "Product add nahi hua."
      );
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="inventory">
      <h1>📦 Inventory Management</h1>

      {/* Add Product */}
      <div className="inventory-form">
        <h2>Add Product</h2>

        <form onSubmit={addProduct}>
          {/* Product Name */}
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              findProductImage(e.target.value);
            }}
            required
          />

          {/* Automatic Image Preview */}
          {autoImage && !image && (
            <div>
              <p>🔍 Automatic Image Found:</p>

              <img
                src={autoImage}
                alt={name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  padding: "5px",
                }}
              />
            </div>
          )}

          {/* Purchase Price */}
          <input
            type="number"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) =>
              setPurchasePrice(e.target.value)
            }
            required
          />

          {/* Selling Price */}
          <input
            type="number"
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(e.target.value)
            }
            required
          />

          {/* Stock */}
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            required
          />

          {/* Manual Image URL */}
          <input
            type="text"
            placeholder="Optional: Paste Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />

          <small>
            💡 Manual image URL doge to wahi image use
            hogi.
            <br />
            Khali chhoda to automatic image use hogi.
          </small>

          <br />
          <br />

          <button type="submit">
            ➕ Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="inventory-list">
        <h2>Available Products</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              className="product-card"
              key={product._id}
            >
              {/* Product Image */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "130px",
                    height: "130px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                >
                  📦 No Image
                </div>
              )}

              <h3>{product.name}</h3>

              <p>
                <strong>Purchase Price:</strong>{" "}
                ₹{product.purchasePrice}
              </p>

              <p>
                <strong>Selling Price:</strong>{" "}
                ₹{product.sellingPrice}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {product.stock}
              </p>

              {product.stock <= 5 && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  ⚠ Low Stock! Refill soon.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Inventory;