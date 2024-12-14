const User = require("../models/User");
const jwt = require("jsonwebtoken");

const adminMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(403)
            .json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user || !user.isAdmin) {
            return res
                .status(403)
                .json({ message: "Access denied: Admins only" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Token is not valid" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = adminMiddleware;
