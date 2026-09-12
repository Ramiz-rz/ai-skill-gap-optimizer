const Job = require("../models/Job");
const Skill = require("../models/Skill");
const Roadmap = require("../models/Roadmap");
const Task = require("../models/Task");
const { aggregateMarketSkills } = require("../services/aggregationService");
const pythonService = require("../services/pythonService");
const { generateRoadmap } = require("../services/roadmapService");

async function generate(req, res, next) {
  try {
    const { targetRole } = req.body;
    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ error: "Target role is required." });
    }

    const jobs = await Job.find();
    if (jobs.length === 0) {
      return res.status(400).json({ error: "Analyze at least one job before generating a roadmap." });
    }

    const userSkills = await Skill.find();
    const marketSkills = aggregateMarketSkills(jobs);

    let gapResult;
    try {
      gapResult = await pythonService.analyzeSkills({
        userSkills: userSkills.map((s) => ({
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
        })),
        marketSkills,
      });
    } catch (err) {
      return res.status(502).json({ error: "The skill analysis service is unavailable." });
    }

    if (gapResult.missing.length === 0) {
      return res.status(400).json({
        error: "No missing skills detected. Your profile already covers the analyzed job requirements.",
      });
    }

    const roadmapData = await generateRoadmap({
      targetRole,
      currentSkills: userSkills,
      missingSkills: gapResult.missing,
      marketSkills,
    });

    // Deactivate any previous roadmap so there is one current roadmap at a time.
    await Roadmap.updateMany({ active: true }, { active: false });

    const roadmap = await Roadmap.create({
      targetRole,
      title: roadmapData.title,
      explanation: roadmapData.explanation,
      source: roadmapData.source,
      weeks: roadmapData.weeks.map((w) => ({
        weekNumber: w.weekNumber,
        focus: w.focus,
        skills: w.skills,
        project: w.project,
        outcome: w.outcome,
      })),
      active: true,
    });

    const taskDocs = [];
    for (const week of roadmapData.weeks) {
      for (const taskTitle of week.tasks) {
        taskDocs.push({
          roadmapId: roadmap._id,
          weekNumber: week.weekNumber,
          title: taskTitle,
          skill: week.skills[0] || "",
          status: "pending",
        });
      }
    }
    const tasks = await Task.insertMany(taskDocs);

    res.status(201).json({ roadmap, tasks });
  } catch (err) {
    next(err);
  }
}

async function getCurrent(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ active: true }).sort({ createdAt: -1 });
    if (!roadmap) {
      return res.json({ roadmap: null, tasks: [] });
    }
    const tasks = await Task.find({ roadmapId: roadmap._id }).sort({ weekNumber: 1, createdAt: 1 });
    res.json({ roadmap, tasks });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, getCurrent };
