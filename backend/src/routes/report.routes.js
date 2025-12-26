const express = require("express");
const router = express.Router();

const { exportShoutouts } = require("../controllers/report.controller");
const adminAuth = require("../middleware/adminAuth");

router.get("/shoutouts/export", adminAuth, exportShoutouts);

module.exports = router;
