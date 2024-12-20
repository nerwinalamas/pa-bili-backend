const express = require("express");
const {
    register,
    login,
    logout,
    verifyToken,
    verifyAdmin,
    profile,
    updateProfile,
    changePassword,
    getShippingPreferences,
    updateShippingPreferences,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/admin", verifyAdmin);
router.get("/profile", authMiddleware, profile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/shipping-preferences", authMiddleware, getShippingPreferences);
router.put("/shipping-preferences", authMiddleware, updateShippingPreferences);

module.exports = router;
