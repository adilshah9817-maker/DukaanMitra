const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    profit: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
