const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    weekNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    skill: { type: String, default: "" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
