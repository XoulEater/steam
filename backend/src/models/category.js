const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategory: { type: String, default: null },
  path: { type: String, required: true },
},
  { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);