const mongoose = require("mongoose");

const usersAuth = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    idCollection: { type: String, required: true },
});