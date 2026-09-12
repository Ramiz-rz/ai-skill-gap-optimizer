const Task = require("../models/Task");

async function updateTask(req, res, next) {
  try {
    const { status } = req.body;
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'pending' or 'completed'." });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

module.exports = { updateTask };
