const express = require("express");
const dotenv = require("dotenv");
const adminLogisticController = require("../controllers/AdminLogisticController");

dotenv.config();

const router = express.Router();

router.put("/:id", adminLogisticController.editOrderStatus);
router.post("/registerAdminLogistic", adminLogisticController.registerAdminLogistic);
router.put("/editAdminLogistic", adminLogisticController.editAdminLogistic);
router.delete("/deleteUsers", adminLogisticController.deleteUsers);
router.post("/registerUsersAdmin", adminLogisticController.registerUsersAdmin);
router.put("/updateUsersAdmin", adminLogisticController.updateUsersAdmin);

module.exports = router;