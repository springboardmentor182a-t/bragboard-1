const express = require("express");
const router = express.Router();

const {
  createReport,
  getMyReports,
  updateReportStatus,
} = require("../controllers/report.controller");

// Employee Routes

// Create a new report
router.post("/", createReport);

// Get all reports submitted by a specific employee
router.get("/:employeeId", getMyReports);

// Admin Routes

// Update report status (Pending → Reviewed → Resolved → Rejected)
router.put("/admin/:reportId", updateReportStatus);

module.exports = router;
