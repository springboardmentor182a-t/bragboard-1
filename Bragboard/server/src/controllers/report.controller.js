const Report = require("../models/report.model");

// Employee creates a report
exports.createReport = async (req, res) => {
  try {
    const { shoutoutId, employeeId, reason, comments } = req.body;

    const report = await Report.create({
      shoutoutId,
      employeeId,
      reason,
      comments,
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Employee gets all his reports
exports.getMyReports = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const reports = await Report.find({ employeeId });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Admin updates report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminComments } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { status, adminComments },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.json({
      success: true,
      message: "Status updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
