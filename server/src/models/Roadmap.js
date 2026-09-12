const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    focus: { type: String, required: true },
    skills: { type: [String], default: [] },
    project: { type: String, default: "" },
    outcome: { type: String, default: "" },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    targetRole: { type: String, required: true },
    title: { type: String, required: true },
    explanation: { type: String, default: "" },
    source: { type: String, enum: ["ai", "fallback"], default: "fallback" },
    weeks: { type: [weekSchema], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
