const Skill = require("../models/Skill");

async function listSkills(req, res, next) {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
}

async function createSkill(req, res, next) {
  try {
    const { name, category, proficiency } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Skill name and category are required." });
    }

    const existing = await Skill.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: "This skill is already in your profile." });
    }

    const skill = await Skill.create({
      name,
      category,
      proficiency: proficiency || "Beginner",
    });
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
}

async function updateSkill(req, res, next) {
  try {
    const { proficiency, category, name } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { ...(proficiency && { proficiency }), ...(category && { category }), ...(name && { name }) },
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ error: "Skill not found." });
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Skill not found." });
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listSkills, createSkill, updateSkill, deleteSkill };
