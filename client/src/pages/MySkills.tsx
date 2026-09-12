import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { skillsApi } from "../api/skills";
import type { UserSkill, Proficiency } from "../api/types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { UserCog } from "lucide-react";
import { ApiError } from "../api/client";

const CATEGORIES = [
  "Programming",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud",
  "DevOps",
  "AI / ML",
  "NLP",
  "Computer Vision",
  "Data",
  "Testing",
  "Other",
];

const PROFICIENCIES: Proficiency[] = ["Beginner", "Intermediate", "Advanced"];

export function MySkills() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [proficiency, setProficiency] = useState<Proficiency>("Beginner");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    skillsApi
      .list()
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    setError(null);
    if (!name.trim()) {
      setError("Enter a skill name.");
      return;
    }
    try {
      const skill = await skillsApi.create({ name: name.trim(), category, proficiency });
      setSkills((prev) => [...prev, skill]);
      setName("");
      setProficiency("Beginner");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add skill.");
    }
  }

  async function handleProficiencyChange(id: string, value: Proficiency) {
    const updated = await skillsApi.update(id, { proficiency: value });
    setSkills((prev) => prev.map((s) => (s._id === id ? updated : s)));
  }

  async function handleRemove(id: string) {
    await skillsApi.remove(id);
    setSkills((prev) => prev.filter((s) => s._id !== id));
  }

  const grouped = skills.reduce<Record<string, UserSkill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">My Skills</h1>
        <p className="text-sm text-muted mt-1">
          Keep your skill profile up to date so gap analysis stays accurate.
        </p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs text-muted">Skill name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Docker" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted">Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted">Proficiency</label>
          <select
            className="input"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as Proficiency)}
          >
            {PROFICIENCIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-1.5 justify-center">
          <Plus size={14} /> Add
        </button>
      </div>
      {error && <p className="text-sm text-red-400 -mt-4">{error}</p>}

      {loading ? (
        <Loader label="Loading your skills..." />
      ) : skills.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No skills added yet"
          description="Add the skills you already have so we can compare them against the job market."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="card p-4">
              <p className="text-sm font-medium mb-3">{cat}</p>
              <div className="flex flex-col gap-2">
                {list.map((skill) => (
                  <div
                    key={skill._id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border"
                  >
                    <span className="text-sm">{skill.name}</span>
                    <div className="flex items-center gap-3">
                      <select
                        className="bg-transparent text-xs text-muted border border-border rounded-md px-2 py-1"
                        value={skill.proficiency}
                        onChange={(e) => handleProficiencyChange(skill._id, e.target.value as Proficiency)}
                      >
                        {PROFICIENCIES.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      <Trash2
                        size={14}
                        className="text-muted hover:text-red-400 cursor-pointer"
                        onClick={() => handleRemove(skill._id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
