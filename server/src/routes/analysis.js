const express = require("express");
const router = express.Router();
const { getLatestAnalysis } = require("../controllers/analysisController");

router.get("/latest", getLatestAnalysis);

module.exports = router;
