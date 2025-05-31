const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

// Login route
router.post("/login", userController.loginUser);

// Get current user route
router.get("/current", userController.getCurrentUser);

// Register new user
router.post("/register", userController.registerUser);

// Logout user
router.post("/logout", userController.logoutUser);

module.exports = router;
