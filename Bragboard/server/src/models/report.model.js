const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    shoutoutId: { type: String, required: true },
    employeeId: { type: String, required: true },
    reason: { type: String, required: true },
    comments: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
