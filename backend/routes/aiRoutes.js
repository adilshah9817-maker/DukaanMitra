const express = require("express");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");

const router = express.Router();

function extractNumber(text) {
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

router.post("/command", async (req, res) => {
  try {
    const text = String(req.body.text || "").trim().toLowerCase();
    if (!text) return res.status(400).json({ message: "Command is required" });

    const number = extractNumber(text);

    if (/(profit|munafa)/i.test(text)) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const sales = await Sale.find({ createdAt: { $gte: start } });
      const profit = sales.reduce((sum, s) => sum + s.profit, 0);
      return res.json({ reply: `Aaj ka total profit ₹${profit.toFixed(2)} hai.`, action: "profit" });
    }

    if (/(sales|sale|bikri)/i.test(text)) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const sales = await Sale.find({ createdAt: { $gte: start } });
      const total = sales.reduce((sum, s) => sum + s.totalAmount, 0);
      return res.json({ reply: `Aaj ki total bikri ₹${total.toFixed(2)} hai.`, action: "sales" });
    }

    if (/(stock|aayi|aaya|maal)/i.test(text) && number) {
      const products = await Product.find();
      const product = products.find(p => text.includes(p.name.toLowerCase()));
      if (!product) return res.json({ reply: "Product ka naam samajh nahi aaya. Dashboard me product add karo.", action: "none" });

      product.quantity += number;
      await product.save();
      return res.json({
        reply: `${product.name} ka stock ${number} se badha diya. Ab stock ${product.quantity} hai.`,
        action: "stock"
      });
    }

    if (/(beche|bika|sale kiya|sold)/i.test(text) && number) {
      const products = await Product.find();
      const product = products.find(p => text.includes(p.name.toLowerCase()));
      if (!product) return res.json({ reply: "Product ka naam nahi mila.", action: "none" });
      if (product.quantity < number) return res.json({ reply: `Itna stock available nahi hai. Sirf ${product.quantity} hai.`, action: "none" });

      const totalAmount = number * product.sellingPrice;
      const profit = number * (product.sellingPrice - product.purchasePrice);
      product.quantity -= number;
      await product.save();

      await Sale.create({
        productName: product.name,
        quantity: number,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        totalAmount,
        profit
      });

      return res.json({
        reply: `${number} ${product.name} becha. ₹${totalAmount.toFixed(2)} ki sale hui aur ₹${profit.toFixed(2)} profit hua.`,
        action: "sale"
      });
    }

    if (/(khata|diya|udhaar)/i.test(text) && number) {
      const customers = await Customer.find();
      const customer = customers.find(c => text.includes(c.name.toLowerCase()));
      if (!customer) return res.json({ reply: "Customer ka naam nahi mila. Pehle Khata me customer add karo.", action: "none" });

      customer.pendingAmount += number;
      await customer.save();
      return res.json({
        reply: `${customer.name} ke khate me ₹${number} add kar diye. Total pending ₹${customer.pendingAmount} hai.`,
        action: "khata"
      });
    }

    return res.json({
      reply: "Command samajh nahi aayi. Example bolo: 'Aaj kitna profit hua' ya 'Maggi stock mein 10 aayi'.",
      action: "none"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
