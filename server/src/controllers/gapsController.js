const Job = require("../models/Job");
const Skill = require("../models/Skill");
const { aggregateMarketSkills } = require("../services/aggregationService");
const pythonService = require("../services/pythonService");

async function analyzeGaps(req, res, next) {
  try {
    const jobs = await Job.find();
    if (jobs.length === 0) {
      return res.status(400).json({
        error: "No jobs analyzed yet. Add at least one job description first.",
      });
    }

    const userSkills = await Skill.find();
    const marketSkills = aggregateMarketSkills(jobs);

    let result;
    try {
      result = await pythonService.analyzeSkills({
        userSkills: userSkills.map((s) => ({
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
        })),
        marketSkills,
      });
    } catch (err) {
      return res.status(502).json({
        error: "The skill analysis service is unavailable. Make sure the Python service is running.",
      });
    }

    res.json({
      ...result,
      totalJobsAnalyzed: jobs.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeGaps };
