require("dotenv").config();
const express = require("express");
const cors = require("cors");

/* -------- DB CONNECTION -------- */
require("./db"); // This will run the MongoDB connection

/* -------- IMPORTS -------- */
const { processHierarchies } = require("./processor");
const authRoutes = require("./routes/auth");
const { protect } = require("./middleware/auth");
const Response = require("./models/ResponseSchema");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------- MIDDLEWARE -------- */

app.use(cors());
app.use(express.json());

/* -------- ROUTES -------- */

// Auth routes
app.use("/auth", authRoutes);

// Process hierarchy data
app.post("/bfhl", protect, async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                error: "Invalid input. Expected JSON body with a 'data' array."
            });
        }

        const result = processHierarchies(data);

        const finalResponse = {
            user_id: "arrav_24042026",
            email_id: "arrav@example.com",
            college_roll_number: "SRM-12345",
            ...result
        };

        // Save result in MongoDB
        const saved = new Response(finalResponse);
        await saved.save();

        res.json(finalResponse);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get stored responses
app.get("/data", async (req, res) => {
    try {
        const data = await Response.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Health check
app.get("/", (req, res) => {
    res.send("Hierarchy Insight Engine API running");
});

/* -------- SERVER -------- */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});