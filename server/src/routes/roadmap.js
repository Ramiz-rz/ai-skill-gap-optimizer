const express = require("express");
const router = express.Router();
const { generate, getCurrent } = require("../controllers/roadmapController");

router.post("/generate", generate);
router.get("/", getCurrent);

module.exports = router;
