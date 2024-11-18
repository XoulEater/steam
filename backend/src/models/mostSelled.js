const mongoose = require("mongoose");

// TODO: Hace falta un schema aparte para esto?
const mostSelledSchema = new mongoose.Schema({
    product : { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sales : { type: Number, required: true },
});