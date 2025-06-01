require('dotenv').config();
const express = require("express");
const { main } = require("./models/index");
const categoryRoute = require("./router/category");
const importRoute = require("./router/import");
const exportRoute = require("./router/export");
const cors = require("cors");
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 5000;
main();
app.use(express.json());
app.use(cors());

// Session middleware
app.use(session({
  secret: 'fashion-inventory-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Category API
app.use("/api/category", categoryRoute);

// Import API
app.use("/api/import", importRoute);

// Export API
app.use("/api/export", exportRoute);

// User API - Simplified authentication

// Hardcoded admin user
const adminUser = {
  _id: "admin123",
  firstName: "Admin",
  lastName: "User",
  email: "admin@gmail.com",
  password: "admin"
};

// Login endpoint
app.post("/api/user/login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminUser.email && password === adminUser.password) {
    // Successful login
    req.session.user = adminUser;
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { ...adminUser, password: undefined } // Don't send password back
    });
  } else {
    // Failed login
    res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
  }
});

// Get current user
app.get("/api/user/current", (req, res) => {
  if (req.session.user) {
    res.json({ ...req.session.user, password: undefined });
  } else {
    res.status(401).json({ error: "Chưa đăng nhập" });
  }
});

// Logout
app.post("/api/user/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Đã đăng xuất" });
});
// Legacy endpoints for backward compatibility
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminUser.email && password === adminUser.password) {
    req.session.user = adminUser;
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { ...adminUser, password: undefined }
    });
  } else {
    res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
  }
});

app.get("/api/login", (req, res) => {
  if (req.session.user) {
    res.json({ ...req.session.user, password: undefined });
  } else {
    res.status(401).json({ error: "Chưa đăng nhập" });
  }
});

app.post("/api/register", (req, res) => {
  res.status(403).json({ error: "Chức năng đăng ký đã bị vô hiệu hóa" });
});


// Dashboard statistics API
app.get("/api/dashboard", async (req, res) => {
  try {
    // Get total categories
    const Category = require('./models/category');
    const Import = require('./models/import');
    const Export = require('./models/export');

    const totalCategories = await Category.countDocuments({ status: 'active' });

    // Get categories with low stock (less than 5)
    const lowStockCategories = await Category.countDocuments({ stock: { $lt: 5 }, status: 'active' });

    // Get current month imports total value
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyImports = await Import.aggregate([
      { $match: { importDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Get current month exports total value
    const monthlyExports = await Export.aggregate([
      { $match: { ExportDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalCategories: totalCategories,
      lowStockCategories: lowStockCategories,
      monthlyImports: monthlyImports.length > 0 ? monthlyImports[0].total : 0,
      monthlyExports: monthlyExports.length > 0 ? monthlyExports[0].total : 0
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
})

// Here we are listening to the server
app.listen(PORT, () => {
  console.log("I am live again");
});
