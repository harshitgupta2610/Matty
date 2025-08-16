// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model("Product", productSchema);
