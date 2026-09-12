"""
Skill taxonomy used by the extraction engine.

Each entry in SKILL_TAXONOMY maps a canonical skill name to:
  - category: the group it belongs to (used for UI grouping and gap weighting)
  - aliases: alternate strings that should resolve to this skill in raw text

To add a new skill, add one entry here. No other code needs to change.
"""

from typing import Dict, List, TypedDict


class SkillDefinition(TypedDict):
    category: str
    aliases: List[str]


SKILL_TAXONOMY: Dict[str, SkillDefinition] = {
    # Programming languages
    "Python": {"category": "Programming", "aliases": ["python", "python3", "py"]},
    "JavaScript": {"category": "Programming", "aliases": ["javascript", "js", "es6", "ecmascript"]},
    "TypeScript": {"category": "Programming", "aliases": ["typescript", "ts"]},
    "Java": {"category": "Programming", "aliases": ["java"]},
    "C++": {"category": "Programming", "aliases": ["c++", "cpp"]},
    "Go": {"category": "Programming", "aliases": ["golang", "go lang"]},
    "SQL": {"category": "Databases", "aliases": ["sql", "structured query language"]},

    # Frontend
    "React": {"category": "Frontend", "aliases": ["react", "react.js", "reactjs"]},
    "Next.js": {"category": "Frontend", "aliases": ["next.js", "nextjs", "next js"]},
    "Tailwind CSS": {"category": "Frontend", "aliases": ["tailwind", "tailwind css", "tailwindcss"]},
    "Flutter": {"category": "Frontend", "aliases": ["flutter"]},

    # Backend
    "Node.js": {"category": "Backend", "aliases": ["node.js", "nodejs", "node js", "node"]},
    "Express": {"category": "Backend", "aliases": ["express", "express.js", "expressjs"]},
    "FastAPI": {"category": "Backend", "aliases": ["fastapi", "fast api"]},
    "Flask": {"category": "Backend", "aliases": ["flask"]},
    "Django": {"category": "Backend", "aliases": ["django"]},
    "REST APIs": {"category": "Backend", "aliases": ["rest api", "rest apis", "restful api", "restful apis", "rest"]},
    "GraphQL": {"category": "Backend", "aliases": ["graphql"]},

    # Databases
    "MongoDB": {"category": "Databases", "aliases": ["mongodb", "mongo db", "mongo"]},
    "PostgreSQL": {"category": "Databases", "aliases": ["postgresql", "postgres", "psql"]},
    "MySQL": {"category": "Databases", "aliases": ["mysql"]},
    "Redis": {"category": "Databases", "aliases": ["redis"]},
    "Vector Databases": {"category": "Databases", "aliases": ["vector database", "vector databases", "vector db", "vector store"]},
    "FAISS": {"category": "Databases", "aliases": ["faiss"]},

    # Cloud / DevOps
    "AWS": {"category": "Cloud", "aliases": ["aws", "amazon web services"]},
    "Azure": {"category": "Cloud", "aliases": ["azure", "microsoft azure"]},
    "GCP": {"category": "Cloud", "aliases": ["gcp", "google cloud", "google cloud platform"]},
    "Docker": {"category": "DevOps", "aliases": ["docker", "containerization"]},
    "Kubernetes": {"category": "DevOps", "aliases": ["kubernetes", "k8s"]},
    "CI/CD": {"category": "DevOps", "aliases": ["ci/cd", "ci cd", "continuous integration", "continuous deployment"]},
    "Git": {"category": "DevOps", "aliases": ["git"]},
    "GitHub": {"category": "DevOps", "aliases": ["github"]},

    # AI / ML
    "Machine Learning": {"category": "AI / ML", "aliases": ["machine learning", "ml"]},
    "Deep Learning": {"category": "AI / ML", "aliases": ["deep learning", "dl"]},
    "TensorFlow": {"category": "AI / ML", "aliases": ["tensorflow", "tensor flow"]},
    "PyTorch": {"category": "AI / ML", "aliases": ["pytorch", "torch"]},
    "Keras": {"category": "AI / ML", "aliases": ["keras"]},
    "Scikit-learn": {"category": "AI / ML", "aliases": ["scikit-learn", "scikit learn", "sklearn"]},
    "XGBoost": {"category": "AI / ML", "aliases": ["xgboost", "xg boost"]},
    "LightGBM": {"category": "AI / ML", "aliases": ["lightgbm", "light gbm"]},
    "MLOps": {"category": "AI / ML", "aliases": ["mlops", "ml ops"]},
    "MLflow": {"category": "AI / ML", "aliases": ["mlflow", "ml flow"]},

    # NLP / LLM
    "NLP": {"category": "NLP", "aliases": ["nlp", "natural language processing"]},
    "LLMs": {"category": "NLP", "aliases": ["llm", "llms", "large language model", "large language models"]},
    "RAG": {"category": "NLP", "aliases": ["rag", "retrieval augmented generation", "retrieval-augmented generation"]},
    "LangChain": {"category": "NLP", "aliases": ["langchain", "lang chain"]},
    "Hugging Face": {"category": "NLP", "aliases": ["hugging face", "huggingface"]},
    "Transformers": {"category": "NLP", "aliases": ["transformers", "transformer models"]},
    "OpenAI API": {"category": "NLP", "aliases": ["openai api", "openai", "gpt api"]},
    "Prompt Engineering": {"category": "NLP", "aliases": ["prompt engineering", "prompt design"]},

    # Computer Vision
    "Computer Vision": {"category": "Computer Vision", "aliases": ["computer vision", "cv", "opencv"]},

    # Data
    "Pandas": {"category": "Data", "aliases": ["pandas"]},
    "NumPy": {"category": "Data", "aliases": ["numpy"]},
    "Data Analysis": {"category": "Data", "aliases": ["data analysis", "data analytics"]},
    "Data Visualization": {"category": "Data", "aliases": ["data visualization", "data viz"]},

    # Testing
    "Testing": {"category": "Testing", "aliases": ["unit testing", "integration testing", "test driven development", "tdd", "pytest", "jest"]},
}

# Reverse index: normalized alias text -> canonical skill name.
# Built once at import time.
ALIAS_TO_SKILL: Dict[str, str] = {}
for _canonical, _definition in SKILL_TAXONOMY.items():
    ALIAS_TO_SKILL[_canonical.lower()] = _canonical
    for _alias in _definition["aliases"]:
        ALIAS_TO_SKILL[_alias.lower()] = _canonical

# Sort aliases by character length (longest first) so phrases that contain
# a shorter alias as a substring (e.g. "node.js" containing "js") are
# matched and masked before the shorter alias gets a chance to fire.
SORTED_ALIASES = sorted(ALIAS_TO_SKILL.keys(), key=lambda s: -len(s))


def get_category(skill_name: str) -> str:
    definition = SKILL_TAXONOMY.get(skill_name)
    return definition["category"] if definition else "Other"
