const express = require("express");
const router = express.Router();
const { createJob, listJobs, deleteJob } = require("../controllers/jobsController");

router.post("/", createJob);
router.get("/", listJobs);
router.delete("/:id", deleteJob);

module.exports = router;
