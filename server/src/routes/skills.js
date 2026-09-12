const express = require("express");
const router = express.Router();
const { listSkills, createSkill, updateSkill, deleteSkill } = require("../controllers/skillsController");

router.get("/", listSkills);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;
