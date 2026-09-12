# AI Skill Gap Detection & Learning Optimizer

**AI Skill Gap Detection & Learning Optimizer** is a full-stack application I built to help developers understand which technical skills they need to improve for the jobs they want.

Instead of giving generic learning advice, the application analyzes real job descriptions, extracts the technical skills being requested, compares them with a user's current skills, and creates a personalized learning roadmap.

## What I Built

The main idea behind the project is simple:

**Job Descriptions → Skill Extraction → Skill Analysis → Gap Detection → Learning Roadmap**

A user can analyze multiple job descriptions, add their current skills and proficiency levels, and see where they stand against the requirements of those jobs.

## Key Features

* Analyze technical skills from job descriptions
* Support multiple job descriptions and aggregate skill demand
* Maintain a personal skill profile with proficiency levels
* Compare current skills against job market requirements
* Calculate an overall skill match score
* Identify missing and partially matched skills
* Prioritize skill gaps based on job demand
* Generate a week-by-week learning roadmap
* Track learning tasks and completion progress
* Dashboard for skills, gaps, roadmap, and progress
* Optional OpenAI integration for personalized roadmap generation
* Built-in fallback roadmap generation when an OpenAI API key is not available

## Architecture

```text
                    React + TypeScript
                           |
                           v
                    Node.js + Express
                           |
             +-------------+-------------+
             |                           |
             v                           v
       MongoDB Database          Python + FastAPI
                                         |
                                         v
                                  NLP / Skill Analysis
```

### Frontend

The frontend is built with React and TypeScript. It provides the interface for analyzing jobs, managing skills, viewing skill gaps, generating roadmaps, and tracking progress.

### Backend

The Node.js and Express backend handles application logic, database operations, API routes, and communication with the Python service.

### NLP Service

The Python service handles skill extraction and skill gap calculations. Skills are identified using a maintained taxonomy with aliases and pattern matching.

### Database

MongoDB stores analyzed jobs, user skills, roadmaps, and learning tasks.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React

### Backend

* Node.js
* Express
* Mongoose

### NLP Service

* Python
* FastAPI
* Pydantic

### Database

* MongoDB

### AI

* OpenAI API

## How Skill Extraction Works

I created a skill taxonomy that maps common technical skills to their aliases.

For example:

```text
Scikit-learn
├── sklearn
└── scikit learn
```

When a job description is analyzed, the NLP service:

1. Normalizes the text.
2. Matches known skills and their aliases.
3. Uses word boundaries to avoid incorrect substring matches.
4. Counts how frequently each skill appears.
5. Assigns a relevance level based on demand within the job description.

The taxonomy can be extended by adding new skills and aliases to:

```text
python-service/app/skill_taxonomy.py
```

## Skill Gap Analysis

Each skill from the analyzed jobs is compared against the user's profile.

There are three possible states:

* **Matched:** The user has the skill at Intermediate or Advanced level.
* **Partial:** The user has the skill at Beginner level.
* **Missing:** The skill is not present in the user's profile.

The overall match score uses the frequency of each skill across analyzed jobs as its weight. Skills that appear frequently have a larger impact on the final score.

## Skill Priority

Missing skills are grouped into three priority levels based on how often they appear across the analyzed jobs:

| Priority |  Job Demand |
| -------- | ----------: |
| High     | 60% or more |
| Medium   |  35% to 59% |
| Low      |   Below 35% |

This helps turn a long list of missing skills into a more practical learning order.

## Learning Roadmap

The application supports two roadmap generation modes.

### OpenAI Mode

When an OpenAI API key is configured, the backend sends the identified skill gaps to the OpenAI API and generates a structured learning roadmap.

### Fallback Mode

If an API key is not configured or the API request fails, the application uses a built-in roadmap generator with predefined learning tasks for common technologies.

This means the main application can still be used without an OpenAI API key.

## Project Structure

```text
ai-skill-gap-optimizer/
│
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── python-service/
│   ├── app/
│   │   ├── analyzer.py
│   │   ├── skill_extractor.py
│   │   └── skill_taxonomy.py
│   └── requirements.txt
│
├── docker-compose.yml
└── README.md
```

## Running Locally

### Requirements

* Node.js 18+
* Python 3.10+
* MongoDB

### 1. Start the Python Service

From the project root:

```powershell
cd python-service

python -m venv .venv

.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

python -m uvicorn app.main:app --reload --port 8000
```

The Python service runs on:

```text
http://localhost:8000
```

### 2. Start the Backend

Open another terminal:

```powershell
cd server

Copy-Item .env.example .env

npm install

npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open another terminal:

```powershell
cd client

Copy-Item .env.example .env

npm install

npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

### Server

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skill-gap-optimizer
PYTHON_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

The `.env` files are intentionally excluded from Git. Use the provided `.env.example` files when setting up the project.

## Example Workflow

1. Open **Job Analysis**.
2. Add or use the demo job description.
3. Analyze the job.
4. Add your current skills and proficiency levels.
5. Open **Skill Gaps** to see your match score.
6. Review the highest-priority missing skills.
7. Generate a learning roadmap.
8. Complete roadmap tasks and track your progress.

## API

### Node.js API

```text
POST   /api/jobs
GET    /api/jobs
DELETE /api/jobs/:id

GET    /api/analysis/latest

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id

POST   /api/gaps

POST   /api/roadmap/generate
GET    /api/roadmap

PUT    /api/tasks/:id

GET    /api/progress
```

### Python API

```text
GET  /health
POST /extract-skills
POST /analyze-skills
```

## Limitations

* Skill extraction currently relies on a predefined taxonomy and phrase matching rather than a trained NLP model.
* Unusual or indirect ways of describing a skill may not be detected.
* The current taxonomy focuses on common programming, AI/ML, NLP, cloud, and data skills.
* Authentication is not included because the current version is designed around a single local user.
* Job descriptions currently need to be provided manually rather than imported directly from job platforms.

## Future Improvements

Some improvements I would like to add:

* Resume upload and automatic skill extraction
* Embedding-based skill matching
* Authentication and multiple user profiles
* Direct job posting integrations
* Larger and more comprehensive skill taxonomy
* Better learning resource recommendations
* More detailed skill trend analysis

## About the Project

I built this project to combine **NLP, backend development, frontend development, database design, and AI integration** into one practical application.

The goal was not just to extract skills from text, but to build a complete workflow around the problem: understand job requirements, identify skill gaps, create a learning plan, and track progress.

**Built by Muhammad Rameez**
