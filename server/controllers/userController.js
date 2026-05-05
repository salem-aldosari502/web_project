const jwt = require("jsonwebtoken");
const User = require('../models/user_info');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

exports.signupUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, birth, gender, phone, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword, birth, gender, phone, role
        });
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            birth: newUser.birth,
            gender: newUser.gender,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            birth: user.birth,
            gender: user.gender,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, gender, avatar } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (gender) updateData.gender = gender;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Return success even if not found — prevents email enumeration
            return res.json({ message: "If that email exists, a reset link has been sent." });
        }

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash it before storing in DB
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save to user — expires in 15 minutes
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Build the reset link — points to your frontend
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send email

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: `"Trip Kuwait" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                    <h2>Password Reset</h2>
                    <p>Hi ${user.name},</p>
                    <p>You requested a password reset. Click the button below to set a new password.</p>
                    <p>This link expires in <strong>15 minutes</strong>.</p>
                    <a href="${resetLink}" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background: #f97316;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        margin: 16px 0;
                    ">Reset Password</a>
                    <p>If you didn't request this, ignore this email.</p>
                </div>
            `
        });

        res.json({ message: "If that email exists, a reset link has been sent." });

    } catch (error) {
        console.error("Forgot password error:", error.message);
        res.status(500).json({ message: "Failed to send reset email. Try again." });
    }
};

// ✅ Step 2: User submits new password with the token from the link
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the incoming token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with matching token that hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Reset link is invalid or has expired." });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in." });

    } catch (error) {
        console.error("Reset password error:", error.message);
        res.status(500).json({ message: "Failed to reset password. Try again." });
    }
};