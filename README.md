# AI Skill Gap Detection & Learning Optimizer

A tool that extracts technical skills from real job descriptions, compares them against a user's own skill profile, and turns the gaps into a week-by-week learning roadmap.

## What problem this solves

Most "which skills should I learn" advice is generic. This tool works from actual job postings instead: paste in the roles you're targeting, add the skills you already have, and it tells you exactly which skills show up most often in those postings, which ones you're missing, and in what order to learn them.

## Key features

- Extracts technical skills from pasted job descriptions using a phrase-matching NLP engine (no black box, fully inspectable taxonomy)
- Aggregates skill frequency across multiple analyzed jobs
- Compares your skill profile against market demand and produces a transparent, weighted match score
- Ranks missing skills into High / Medium / Low priority based on how often they appear in the market
- Generates a learning roadmap, either via the OpenAI API or a deterministic built-in generator if no API key is configured
- Tracks roadmap task completion and shows real progress, never fabricated numbers

## Architecture

```
React (client) -> Node/Express (server) -> Python/FastAPI (python-service)
                        |
                     MongoDB
```

- **Python service**: does one job well, skill extraction and gap-analysis math. Stateless.
- **Node/Express**: owns application data (jobs, skills, roadmaps, tasks), talks to MongoDB, and delegates NLP work to the Python service.
- **React client**: talks only to the Node API.

This split keeps the NLP logic in Python (where taxonomy/regex work is natural) and the application/data layer in Node, without introducing a second database or duplicating logic.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide icons
- Backend: Node.js, Express, Mongoose
- NLP service: Python, FastAPI, Pydantic
- Database: MongoDB
- AI (optional): OpenAI API for roadmap generation

## Project structure

```
ai-skill-gap-optimizer/
├── client/            React frontend
├── server/             Node/Express API + MongoDB models
├── python-service/     FastAPI NLP microservice
├── docker-compose.yml
└── README.md
```

## How skill extraction works

`python-service/app/skill_taxonomy.py` defines a canonical skill list (e.g. "Scikit-learn") with aliases ("sklearn", "scikit learn"). The extractor in `skill_extractor.py`:

1. Normalizes the input text.
2. Matches aliases longest-first, so a phrase like "machine learning" is matched and masked before a shorter overlapping alias can fire.
3. Uses word-boundary regex matching, not substring search, so "js" does not falsely match inside "Node.js".
4. Counts occurrences per canonical skill and labels relevance (High/Medium/Low) relative to the most-mentioned skill in that posting.

Adding a new skill means adding one entry to the taxonomy file. No other code changes.

## How skill matching / gap analysis works

For each skill the market asks for (aggregated across all analyzed jobs):

- **Matched**: you have it listed at Intermediate or Advanced.
- **Partial**: you have it listed at Beginner.
- **Missing**: you don't have it listed.

The overall match score is a weighted average, where each skill's weight is how often it appears across your analyzed jobs (frequencyPercent). A skill mentioned in 90% of postings affects the score far more than one mentioned in 10%. Matched = full weight, partial = half weight, missing = zero. This logic lives in `python-service/app/analyzer.py` and is documented in code comments there.

## How priority is calculated

Missing skills are ranked purely by how often they show up in your analyzed jobs:

- High: appears in 60%+ of analyzed jobs
- Medium: appears in 35% to 59%
- Low: below 35%

## How AI roadmap generation works

`server/src/services/roadmapService.js` tries the OpenAI API first (if `OPENAI_API_KEY` is set), asking it to turn your missing skills into a week-by-week plan with concrete tasks. If no key is set, or the call fails for any reason, it falls back to `server/src/services/fallbackRoadmap.js`, a deterministic generator with hand-written task templates for common skills (Docker, Kubernetes, AWS, RAG, LangChain, FastAPI, and more) and a still-concrete generic template for anything else. The UI clearly labels which mode produced the roadmap.

## Local setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Python service

```bash
cd python-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Node backend

```bash
cd server
cp .env.example .env
# edit .env: set MONGODB_URI, and optionally OPENAI_API_KEY
npm install
npm run dev
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Docker (MongoDB + backend + Python service)

```bash
docker compose up --build
```

Run the frontend separately during development (`cd client && npm run dev`).

## Environment variables

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skill-gap-optimizer
PYTHON_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Example workflow

1. Go to Job Analysis, click "Try Demo Data", then "Analyze Job".
2. Go to My Skills and add a few skills with proficiency levels.
3. Go to Skill Gaps to see your match score and priority list.
4. Go to Roadmap and generate a plan for your target role.
5. Check off tasks as you complete them and watch Progress update.

## API endpoints

**Node/Express** (`/api`)
- `POST /jobs`, `GET /jobs`, `DELETE /jobs/:id`
- `GET /analysis/latest`
- `GET /skills`, `POST /skills`, `PUT /skills/:id`, `DELETE /skills/:id`
- `POST /gaps`
- `POST /roadmap/generate`, `GET /roadmap`
- `PUT /tasks/:id`
- `GET /progress`

**Python/FastAPI**
- `GET /health`
- `POST /extract-skills`
- `POST /analyze-skills`

## Limitations

- Skill extraction is phrase-matching based, not a trained NLP model. It handles structured job-description text well but will miss skills phrased in unusual ways or referenced only indirectly.
- There is no authentication; this is built around a single local user, by design, to keep the project runnable without extra setup.
- Progress analytics are derived directly from task completion timestamps rather than a separate event log, which keeps the numbers guaranteed to match what's actually in the database.
- The taxonomy currently covers roughly 55 common skills across programming, AI/ML, NLP, cloud, and data. It is easy to extend but is not exhaustive.

## Future improvements

- Add embedding-based skill matching to catch phrasing the taxonomy misses.
- Support authentication for multiple users.
- Let users import a resume to seed their skill profile automatically.
- Add job-source integrations (e.g. pulling postings from a URL) instead of manual paste.
