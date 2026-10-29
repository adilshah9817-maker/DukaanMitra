const express = require("express");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

const router = express.Router();

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Sell product
router.post("/", async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    const qty = Number(quantity);

    if (!productName || !qty || qty <= 0) {
      return res.status(400).json({
        message: "Product name and valid quantity are required",
      });
    }

    // Find product
    const product = await Product.findOne({
      name: {
        $regex: `^${productName.trim()}$`,
        $options: "i",
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock < qty) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) available`,
      });
    }

    // Calculate sale
    const totalAmount = qty * product.sellingPrice;

    const profit =
      qty * (product.sellingPrice - product.purchasePrice);

    // Decrease stock
    product.stock -= qty;

    await product.save();

    // Save sale
    const sale = await Sale.create({
      productName: product.name,
      quantity: qty,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      totalAmount: totalAmount,
      profit: profit,
    });

    res.status(201).json({
      message: "Product sold successfully",
      sale: sale,
      remainingStock: product.stock,
    });
  } catch (err) {
    console.log("SALE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// Today's sales summary
router.get("/summary/today", async (req, res) => {
  try {
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    const sales = await Sale.find({
      createdAt: {
        $gte: start,
      },
    });

    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    const totalProfit = sales.reduce(
      (sum, sale) => sum + sale.profit,
      0
    );

    const itemsSold = sales.reduce(
      (sum, sale) => sum + sale.quantity,
      0
    );

    res.json({
      totalSales,
      totalProfit,
      itemsSold,
      numberOfBills: sales.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;