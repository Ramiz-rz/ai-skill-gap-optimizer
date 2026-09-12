require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB, dbIsConnected } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const jobsRoutes = require("./routes/jobs");
const analysisRoutes = require("./routes/analysis");
const skillsRoutes = require("./routes/skills");
const gapsRoutes = require("./routes/gaps");
const roadmapRoutes = require("./routes/roadmap");
const tasksRoutes = require("./routes/tasks");
const progressRoutes = require("./routes/progress");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: dbIsConnected() ? "connected" : "disconnected" });
});

app.use("/api/jobs", jobsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/gaps", gapsRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
  });
});
