const mongoose = require("../db");

const responseSchema = new mongoose.Schema({
    user_id: String,
    email_id: String,
    college_roll_number: String,
    hierarchies: [Object],
    invalid_entries: [String],
    duplicate_edges: [String],
    summary: {
        total_trees: Number,
        total_cycles: Number,
        largest_tree_root: String
    }
});

module.exports = mongoose.model("response_schema", responseSchema);