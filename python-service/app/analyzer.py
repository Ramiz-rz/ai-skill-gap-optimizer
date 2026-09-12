"""
Gap analysis logic.

Rules (also documented in the top-level README so the score is never a
mystery number):

Status:
  - matched: the user has the skill listed at Intermediate or Advanced.
  - partial: the user has the skill listed at Beginner.
  - missing: the user does not have the skill listed at all.

Match score:
  Each market skill has a weight equal to its frequencyPercent (how many
  analyzed job postings mentioned it). The score is a weighted average:

    score = sum(weight * status_value) / sum(weight) * 100

  where status_value is 1.0 for matched, 0.5 for partial, 0.0 for missing.

  This means a skill that shows up in 90% of job postings affects the score
  far more than one that shows up in 10%, which is the intended behavior:
  matching the skills the market actually asks for should matter more.

Priority (missing skills only):
  - High:   frequencyPercent >= 60
  - Medium: frequencyPercent >= 35
  - Low:    below 35

  Priority is based purely on market frequency, which keeps it explainable
  and reproducible from the same input data every time.
"""

from typing import List
from app.models import UserSkill, AggregatedJobSkill, GapItem, AnalyzeSkillsResponse


def _priority_for(frequency_percent: float) -> str:
    if frequency_percent >= 60:
        return "High"
    if frequency_percent >= 35:
        return "Medium"
    return "Low"


def analyze_gaps(
    user_skills: List[UserSkill],
    market_skills: List[AggregatedJobSkill],
) -> AnalyzeSkillsResponse:
    user_by_name = {s.name: s for s in user_skills}

    matched: List[GapItem] = []
    partial: List[GapItem] = []
    missing: List[GapItem] = []

    weighted_sum = 0.0
    weight_total = 0.0

    for market_skill in market_skills:
        weight = max(market_skill.frequencyPercent, 0.0)
        weight_total += weight

        user_skill = user_by_name.get(market_skill.skill)

        if user_skill and user_skill.proficiency in ("Intermediate", "Advanced"):
            status_value = 1.0
            item = GapItem(
                skill=market_skill.skill,
                category=market_skill.category,
                status="matched",
                frequencyPercent=market_skill.frequencyPercent,
                userProficiency=user_skill.proficiency,
            )
            matched.append(item)
        elif user_skill and user_skill.proficiency == "Beginner":
            status_value = 0.5
            item = GapItem(
                skill=market_skill.skill,
                category=market_skill.category,
                status="partial",
                frequencyPercent=market_skill.frequencyPercent,
                userProficiency=user_skill.proficiency,
            )
            partial.append(item)
        else:
            status_value = 0.0
            item = GapItem(
                skill=market_skill.skill,
                category=market_skill.category,
                status="missing",
                frequencyPercent=market_skill.frequencyPercent,
                priority=_priority_for(market_skill.frequencyPercent),
            )
            missing.append(item)

        weighted_sum += weight * status_value

    match_score = (weighted_sum / weight_total * 100) if weight_total > 0 else 0.0

    matched.sort(key=lambda i: i.frequencyPercent, reverse=True)
    partial.sort(key=lambda i: i.frequencyPercent, reverse=True)
    missing.sort(key=lambda i: i.frequencyPercent, reverse=True)

    return AnalyzeSkillsResponse(
        matchScore=round(match_score, 1),
        matched=matched,
        partial=partial,
        missing=missing,
    )
