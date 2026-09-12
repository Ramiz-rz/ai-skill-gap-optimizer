const Task = require("../models/Task");
const Roadmap = require("../models/Roadmap");

/**
 * Progress is not stored as a separate log. It is derived directly from
 * Task documents (status + completedAt), which keeps it impossible for the
 * numbers to drift out of sync with what the user actually did.
 */
async function getProgress(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ active: true }).sort({ createdAt: -1 });
    if (!roadmap) {
      return res.json({
        hasRoadmap: false,
        overallProgress: 0,
        completedTasks: 0,
        remainingTasks: 0,
        skillsImproved: [],
        weeklyActivity: [],
      });
    }

    const tasks = await Task.find({ roadmapId: roadmap._id });
    const completed = tasks.filter((t) => t.status === "completed");
    const overallProgress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

    const skillsImproved = [...new Set(completed.map((t) => t.skill).filter(Boolean))];

    // Group completed tasks by the ISO week they were completed in.
    const byWeek = new Map();
    for (const task of completed) {
      if (!task.completedAt) continue;
      const date = new Date(task.completedAt);
      const weekLabel = isoWeekLabel(date);
      byWeek.set(weekLabel, (byWeek.get(weekLabel) || 0) + 1);
    }
    const weeklyActivity = Array.from(byWeek.entries())
      .map(([week, tasksCompleted]) => ({ week, tasksCompleted }))
      .sort((a, b) => (a.week > b.week ? 1 : -1));

    res.json({
      hasRoadmap: true,
      targetRole: roadmap.targetRole,
      overallProgress,
      completedTasks: completed.length,
      remainingTasks: tasks.length - completed.length,
      skillsImproved,
      weeklyActivity,
    });
  } catch (err) {
    next(err);
  }
}

function isoWeekLabel(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

module.exports = { getProgress };
