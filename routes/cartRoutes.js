const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getUserCart,
    addItemToCart,
    updateItemQuantity,
    removeFromCart,
    checkout,
    getCartItemCount,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", authMiddleware, getUserCart);
router.post("/", authMiddleware, addItemToCart);
router.put("/", authMiddleware, updateItemQuantity);
router.delete("/", authMiddleware, removeFromCart);
router.post("/checkout", authMiddleware, checkout);
router.get("/count/:userId", authMiddleware, getCartItemCount);

module.exports = router;
