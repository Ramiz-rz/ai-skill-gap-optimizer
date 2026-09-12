from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    AnalyzeJobRequest,
    AnalyzeJobResponse,
    SkillHit,
    AnalyzeSkillsRequest,
    AnalyzeSkillsResponse,
)
from app.skill_extractor import extract_skills, relevance_label
from app.analyzer import analyze_gaps

app = FastAPI(
    title="Skill Extraction & Gap Analysis Service",
    description="NLP microservice for the AI Skill Gap Detection & Learning Optimizer.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "python-skill-service"}


@app.post("/extract-skills", response_model=AnalyzeJobResponse)
def extract_skills_endpoint(payload: AnalyzeJobRequest):
    if not payload.description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    raw = extract_skills(payload.description)
    max_count = raw[0]["count"] if raw else 0

    skills = [
        SkillHit(
            skill=r["skill"],
            category=r["category"],
            count=r["count"],
            relevance=relevance_label(r["count"], max_count),
        )
        for r in raw
    ]

    return AnalyzeJobResponse(
        jobTitle=payload.jobTitle,
        company=payload.company,
        totalSkillsDetected=len(skills),
        skills=skills,
    )


@app.post("/analyze-skills", response_model=AnalyzeSkillsResponse)
def analyze_skills_endpoint(payload: AnalyzeSkillsRequest):
    if not payload.marketSkills:
        raise HTTPException(
            status_code=400,
            detail="No market skills provided. Analyze at least one job first.",
        )
    return analyze_gaps(payload.userSkills, payload.marketSkills)
