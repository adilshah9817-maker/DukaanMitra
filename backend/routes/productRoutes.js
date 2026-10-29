const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// Add product
router.post("/", async (req, res) => {
  try {
    console.log("PRODUCT DATA RECEIVED:", req.body);

    const {
      name,
      stock,
      purchasePrice,
      sellingPrice,
      image,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    const product = new Product({
      name: name,
      stock: Number(stock),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      image: image || "",
    });

    await product.save();

    console.log("PRODUCT SAVED:", product);

    res.status(201).json(product);
  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// Update stock
router.put("/:id/stock", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.stock += amount;

    if (product.stock < 0) {
      product.stock = 0;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.log("UPDATE STOCK ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;