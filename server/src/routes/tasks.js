const express = require("express");
const router = express.Router();
const { updateTask } = require("../controllers/tasksController");

router.put("/:id", updateTask);

module.exports = router;
