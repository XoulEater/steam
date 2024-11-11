const mongoose = require("mongoose");

const mostSelledSchema = new mongoose.Schema({
    product : { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sales : { type: Number, required: true },
});