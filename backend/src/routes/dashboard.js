const express = require("express");
const dotenv = require("dotenv");
const dashboardController = require("../controllers/DashboardController");

dotenv.config();

const router = express.Router();

router.get("/sales", dashboardController.getSales);

module.exports = router;