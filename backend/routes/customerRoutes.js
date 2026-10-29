const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Add customer
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      pendingAmount,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    const customer = await Customer.create({
      name,
      phone: phone || "",
      pendingAmount: Number(pendingAmount || 0),
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Record payment
router.put("/:id/payment", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid payment amount is required",
      });
    }

    const customer = await Customer.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (amount > customer.pendingAmount) {
      return res.status(400).json({
        message: "Payment pending amount se zyada hai",
      });
    }

    customer.pendingAmount =
      customer.pendingAmount - amount;

    await customer.save();

    res.json(customer);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;