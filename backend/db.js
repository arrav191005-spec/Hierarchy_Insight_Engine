const mongoose = require("mongoose");

if (mongoose.connection.readyState === 0) {
    mongoose.connect("mongodb://127.0.0.1:27017/Hierarchy_Insight_Engine")
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
}

module.exports = mongoose;