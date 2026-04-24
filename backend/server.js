const express = require('express');
const cors = require('cors');
const { processHierarchies } = require('./processor');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

/**
 * POST /bfhl
 * Processes hierarchical data provided in the request body.
 */
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ 
                error: "Invalid input. Expected JSON body with a 'data' array of strings." 
            });
        }

        const result = processHierarchies(data);

        // Final Response Format as requested
        const finalResponse = {
            user_id: "arrav_24042026", // Example: yourname_ddmmyyyy
            email_id: "arrav@example.com", // Placeholder
            college_roll_number: "SRM-12345", // Placeholder
            ...result
        };

        res.json(finalResponse);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "An internal server error occurred while processing the request." });
    }
});

// Simple health check endpoint
app.get('/', (req, res) => {
    res.send("Hierarchy Insight Engine API is running.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
