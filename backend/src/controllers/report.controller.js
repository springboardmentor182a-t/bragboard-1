const { exportCSV, exportPDF } = require("../services/export.service");

exports.exportShoutouts = (req, res) => {
  const format = req.query.format;

  if (format === "csv") {
    return exportCSV(res);
  }

  if (format === "pdf") {
    return exportPDF(res);
  }

  return res.status(400).json({ error: "Invalid export format" });
};
