const Job = require("../models/Job");
const { aggregateMarketSkills } = require("../services/aggregationService");

async function getLatestAnalysis(req, res, next) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.json({
        totalJobs: 0,
        marketSkills: [],
        message: "No jobs analyzed yet.",
      });
    }

    const marketSkills = aggregateMarketSkills(jobs);

    res.json({
      totalJobs: jobs.length,
      marketSkills,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLatestAnalysis };
