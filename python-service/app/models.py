from typing import List, Optional
from pydantic import BaseModel, Field


class AnalyzeJobRequest(BaseModel):
    jobTitle: str = Field(..., min_length=1)
    company: Optional[str] = None
    description: str = Field(..., min_length=10)


class SkillHit(BaseModel):
    skill: str
    category: str
    count: int
    relevance: str


class AnalyzeJobResponse(BaseModel):
    jobTitle: str
    company: Optional[str] = None
    totalSkillsDetected: int
    skills: List[SkillHit]


class UserSkill(BaseModel):
    name: str
    category: str
    proficiency: str  # Beginner | Intermediate | Advanced


class AggregatedJobSkill(BaseModel):
    skill: str
    category: str
    jobsMentioningCount: int
    totalJobs: int
    frequencyPercent: float


class AnalyzeSkillsRequest(BaseModel):
    userSkills: List[UserSkill]
    marketSkills: List[AggregatedJobSkill]


class GapItem(BaseModel):
    skill: str
    category: str
    status: str  # matched | partial | missing
    frequencyPercent: float
    userProficiency: Optional[str] = None
    priority: Optional[str] = None  # High | Medium | Low, only for missing


class AnalyzeSkillsResponse(BaseModel):
    matchScore: float
    matched: List[GapItem]
    partial: List[GapItem]
    missing: List[GapItem]
