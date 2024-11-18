const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
    idMostSelled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    dailyUsers: { type: Number, required: true },
    dailyOrders: { type: Number, required: true },
});

module.exports = mongoose.model("Dashboard", dashboardSchema);