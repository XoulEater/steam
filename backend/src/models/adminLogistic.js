const mongoose = require("mongoose");

const adminLogisticSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "logistic"], required: true }, 
  notifications: [{ type: String }], // Lista de notificaciones
}, { timestamps: true });

module.exports = mongoose.model("AdminLogistic", adminLogisticSchema);
