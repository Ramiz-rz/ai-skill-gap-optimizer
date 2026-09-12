const axios = require("axios");
const { generateFallbackRoadmap } = require("./fallbackRoadmap");

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function buildPrompt({ targetRole, currentSkills, missingSkills, priorityGaps, marketSkills }) {
  return `You are a technical career mentor. Build a practical, week-by-week learning roadmap.

Target role: ${targetRole}

User's current skills: ${currentSkills.map((s) => `${s.name} (${s.proficiency})`).join(", ") || "none listed"}

Missing skills detected from real job postings, most important first:
${missingSkills.map((s) => `- ${s.skill} (${s.priority} priority, appears in ${s.frequencyPercent}% of analyzed postings)`).join("\n")}

Return ONLY valid JSON, no markdown fences, no preamble, matching this exact shape:
{
  "title": string,
  "explanation": string (2-3 sentences, no marketing language),
  "weeks": [
    {
      "weekNumber": number,
      "focus": string,
      "skills": string[],
      "tasks": string[] (3-5 concrete, specific tasks, never vague phrases like "learn more about X"),
      "project": string (one concrete small project),
      "outcome": string (one concrete deliverable)
    }
  ]
}

Cover at most 8 weeks, prioritizing the highest priority missing skills first. Keep tasks concrete and actionable. Do not use marketing language.`;
}

async function generateWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: buildPrompt(input) }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const raw = response.data.choices?.[0]?.message?.content || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return { ...parsed, source: "ai" };
  } catch (err) {
    console.error("[roadmapService] OpenAI generation failed, falling back:", err.message);
    return null;
  }
}

async function generateRoadmap({ targetRole, currentSkills, missingSkills, marketSkills }) {
  const aiResult = await generateWithOpenAI({
    targetRole,
    currentSkills,
    missingSkills,
    marketSkills,
  });

  if (aiResult) return aiResult;

  return generateFallbackRoadmap(missingSkills, targetRole);
}

module.exports = { generateRoadmap };
