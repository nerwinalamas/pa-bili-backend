const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getOrderById, getUserOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;
