const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (IMPORTANT FIXED)
mongoose.connect("mongodb://127.0.0.1:27017/hostelDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// User schema
const User = mongoose.model("User", {
    username: String,
    email: String,
    password: String
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    try {
        console.log("REGISTER REQUEST:", req.body);

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        console.log("USER SAVED SUCCESSFULLY");

        res.json({ success: true, message: "Registered Successfully" });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Server error" });
    }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        console.log("LOGIN REQUEST:", req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        console.log("USER FOUND:", user);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: "Invalid Email or Password ❌" });
        }

        res.json({ success: true, message: "Login successful" });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Server error" });
    }
});

// server start
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

