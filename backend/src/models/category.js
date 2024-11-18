const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategory: { type: String, default: null },
  path: { type: String, required: true },
  discount: { type: Number, min: 0, max: 100 },
},
  { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);