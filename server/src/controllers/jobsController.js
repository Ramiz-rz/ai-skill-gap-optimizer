const Job = require("../models/Job");
const pythonService = require("../services/pythonService");

async function createJob(req, res, next) {
  try {
    const { jobTitle, company, description } = req.body;

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({ error: "Job title is required." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: "Job description is required." });
    }

    let extraction;
    try {
      extraction = await pythonService.extractSkills({ jobTitle, company, description });
    } catch (err) {
      return res.status(502).json({
        error: "The skill extraction service is unavailable. Make sure the Python service is running.",
      });
    }

    const job = await Job.create({
      jobTitle,
      company: company || "",
      description,
      detectedSkills: extraction.skills,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

async function listJobs(req, res, next) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Job not found." });
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createJob, listJobs, deleteJob };
