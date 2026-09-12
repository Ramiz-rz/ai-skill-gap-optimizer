const axios = require("axios");

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: PYTHON_SERVICE_URL,
  timeout: 15000,
});

async function extractSkills({ jobTitle, company, description }) {
  const { data } = await client.post("/extract-skills", { jobTitle, company, description });
  return data;
}

async function analyzeSkills({ userSkills, marketSkills }) {
  const { data } = await client.post("/analyze-skills", { userSkills, marketSkills });
  return data;
}

async function checkHealth() {
  const { data } = await client.get("/health");
  return data;
}

module.exports = { extractSkills, analyzeSkills, checkHealth };
