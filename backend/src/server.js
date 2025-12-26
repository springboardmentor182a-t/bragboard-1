const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/report.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
