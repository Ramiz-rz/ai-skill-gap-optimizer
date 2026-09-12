"""
Skill extraction engine.

Approach:
1. Normalize the input text (lowercase, strip punctuation that would break
   phrase matching, collapse whitespace).
2. Walk the sorted alias list (longest phrases first) and count
   non-overlapping occurrences of each alias as a whole-word / whole-phrase
   match using regex word boundaries.
3. Aggregate counts per canonical skill name.
4. Compute a simple relevance label from frequency.

This is deliberately a transparent, deterministic phrase-matching approach
rather than a black box. It is accurate for structured job description text
and easy to extend by editing skill_taxonomy.py.
"""

import re
from typing import Dict, List

from app.skill_taxonomy import SORTED_ALIASES, ALIAS_TO_SKILL, get_category


def _normalize(text: str) -> str:
    text = text.lower()
    # Keep alphanumerics, spaces, plus signs (for C++), dots (for Node.js),
    # slashes (for CI/CD), and hyphens (for scikit-learn).
    text = re.sub(r"[^a-z0-9\+\./\-\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _build_pattern(alias: str) -> re.Pattern:
    # Escape the alias, then relax internal whitespace to match one-or-more
    # spaces (in case of extra spacing) and anchor on word boundaries.
    escaped = re.escape(alias)
    escaped = escaped.replace(r"\ ", r"\s+")
    return re.compile(rf"(?<![a-z0-9]){escaped}(?![a-z0-9])")


_PATTERN_CACHE: Dict[str, re.Pattern] = {}
for _alias in SORTED_ALIASES:
    _PATTERN_CACHE[_alias] = _build_pattern(_alias)


def extract_skills(text: str) -> List[dict]:
    """
    Extract skills from raw text.

    Returns a list of dicts:
      { "skill": str, "category": str, "count": int }

    Matching is done longest-alias-first and matched spans are masked out
    so a longer phrase (e.g. "machine learning") is not double counted by
    a shorter overlapping one.
    """
    normalized = _normalize(text)
    working = normalized
    counts: Dict[str, int] = {}

    for alias in SORTED_ALIASES:
        pattern = _PATTERN_CACHE[alias]
        matches = list(pattern.finditer(working))
        if not matches:
            continue
        skill = ALIAS_TO_SKILL[alias]
        counts[skill] = counts.get(skill, 0) + len(matches)
        # Mask matched spans with '#' characters (same length) so shorter
        # aliases nested inside this phrase are not matched again, while
        # keeping string length stable for subsequent regex offsets.
        working = pattern.sub(lambda m: "#" * len(m.group(0)), working)

    results = [
        {"skill": skill, "category": get_category(skill), "count": count}
        for skill, count in counts.items()
    ]
    results.sort(key=lambda r: r["count"], reverse=True)
    return results


def relevance_label(count: int, max_count: int) -> str:
    if max_count <= 0:
        return "Low"
    ratio = count / max_count
    if ratio >= 0.6:
        return "High"
    if ratio >= 0.3:
        return "Medium"
    return "Low"
