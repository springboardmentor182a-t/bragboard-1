require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const reportRoutes = require("./routes/report.routes");

const app = express();

// Middleware to read JSON body
app.use(express.json());

// Connect to MongoDB
connectDB();

// Base Route
app.get("/", (req, res) => {
  res.send("Reporting Shoutouts API is Running 🚀");
});

// All report routes
app.use("/api/reports", reportRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`➡️  Open in browser: http://localhost:${PORT}`);
});
