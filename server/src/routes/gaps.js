const express = require("express");
const router = express.Router();
const { analyzeGaps } = require("../controllers/gapsController");

router.post("/", analyzeGaps);

module.exports = router;
