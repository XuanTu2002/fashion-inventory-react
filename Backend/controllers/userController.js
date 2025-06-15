const User = require('../models/user');
const bcrypt = require('bcrypt');

// Đăng nhập
const login = async (req, res) => {
    try {
        console.log("Login attempt:", req.body.email); // Log để debug
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // So sánh mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Password incorrect for:", email);
            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // Lưu user vào session
        req.session.user = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        };

        console.log("Login successful:", email, "Session:", req.sessionID);

        // Trả về thông tin user (không bao gồm password)
        return res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Lỗi đăng nhập" });
    }
};

// Lấy thông tin user hiện tại từ session
const getCurrentUser = async (req, res) => {
    try {
        if (req.session.user) {
            return res.json(req.session.user);
        } else {
            return res.status(401).json({ error: "Chưa đăng nhập" });
        }
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({ error: "Lỗi lấy thông tin người dùng" });
    }
};

// Đăng xuất
const logout = async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Lỗi đăng xuất" });
            }
            res.clearCookie('connect.sid');
            return res.json({ message: "Đã đăng xuất" });
        });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi đăng xuất" });
    }
};

module.exports = {
    login,
    getCurrentUser,
    logout
};
