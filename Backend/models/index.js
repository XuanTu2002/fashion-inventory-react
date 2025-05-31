// Backend/models/index.js
require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

async function main() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✔️ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

module.exports = { main };                   
