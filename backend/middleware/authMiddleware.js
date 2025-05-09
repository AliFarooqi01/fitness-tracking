const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    console.log("Received token:", token); // 👈 log token
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // 👈 log decoded data
        req.user = await User.findById(decoded.id).select('-password');
        console.log("Authenticated user:", req.user); // 👈 log attached user
        next();
    } catch (err) {
        console.error("Token error:", err.message); // 👈 helpful error logging
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};
