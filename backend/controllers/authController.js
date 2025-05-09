const crypto = require("crypto");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); 

// Ganerate JWT Token

const ganerateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// register User

exports.registerUser = async (req, res) => {

    const { fullName, email, password, profileImageUrl } = req.body;

    // Validation: Check for missing fields 
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    // Check if email already exists
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
        // Generate JWT Token
        res.status(201).json({
            id: user._id,
            user,
            token: ganerateToken(user._id),
        });

    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
}

// login User


exports.loginUser = async (req, res) => {

    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    // Check if user exists
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate JWT Token
        res.status(200).json({
            id: user._id,
            user,
            token: ganerateToken(user._id),
        });

    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });

    }
}

// get User Info User

exports.getUserInfo = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });

    }

}

exports.updateUserProfile = async (req, res) => {
    const { fullName, email, phone, address, profileImageUrl } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;

        await user.save();

        res.status(200).json({ message: "Profile updated", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
};


// ✅ FORGOT PASSWORD - Generate reset token and email it
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await sendEmail(user.email, "Password Reset", `
        <p>Hi ${user.fullName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `);

        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ RESET PASSWORD - Update password with token
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};  

