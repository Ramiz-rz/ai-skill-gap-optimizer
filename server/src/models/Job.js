const mongoose = require("mongoose");

const detectedSkillSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    category: { type: String, required: true },
    count: { type: Number, required: true },
    relevance: { type: String, required: true },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    company: { type: String, default: "" },
    description: { type: String, required: true },
    detectedSkills: { type: [detectedSkillSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
