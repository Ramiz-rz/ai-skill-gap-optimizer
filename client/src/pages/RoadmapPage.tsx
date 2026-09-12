import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Map as MapIcon } from "lucide-react";
import { roadmapApi } from "../api/roadmap";
import { tasksApi } from "../api/tasks";
import type { Roadmap, Task } from "../api/types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ApiError } from "../api/client";

export function RoadmapPage() {
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await roadmapApi.current();
    setRoadmap(data.roadmap);
    setTasks(data.tasks);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    try {
      const data = await roadmapApi.generate(targetRole);
      setRoadmap(data.roadmap);
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not generate a roadmap.");
    } finally {
      setGenerating(false);
    }
  }

  async function toggleTask(task: Task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    const updated = await tasksApi.updateStatus(task._id, nextStatus);
    setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
  }

  if (loading) return <Loader label="Loading your roadmap..." />;

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const overallProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const weeks = roadmap?.weeks || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Learning Roadmap</h1>
          <p className="text-sm text-muted mt-1">A week-by-week plan built from your missing skills.</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-48"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role"
          />
          <button onClick={handleGenerate} disabled={generating} className="btn-primary whitespace-nowrap">
            {generating ? "Building roadmap..." : roadmap ? "Regenerate" : "Generate Roadmap"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!roadmap ? (
        <EmptyState
          icon={MapIcon}
          title="No roadmap yet"
          description="Generate a roadmap once you have analyzed at least one job and added your skills."
        />
      ) : (
        <>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium">{roadmap.title}</p>
                <p className="text-xs text-muted mt-1 max-w-xl">{roadmap.explanation}</p>
              </div>
              <span className="text-lg font-semibold text-accent-light shrink-0 ml-4">{overallProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden mt-3">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {roadmap.source === "fallback" && (
              <p className="text-xs text-muted mt-3">
                Using the built-in roadmap generator. Add an OpenAI API key for personalized AI-generated
                plans.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {weeks.map((week) => {
              const weekTasks = tasks.filter((t) => t.weekNumber === week.weekNumber);
              return (
                <div key={week.weekNumber} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">
                      Week {week.weekNumber} · {week.focus}
                    </p>
                    <span className="text-xs text-muted">
                      {weekTasks.filter((t) => t.status === "completed").length}/{weekTasks.length} done
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    {weekTasks.map((task) => (
                      <button
                        key={task._id}
                        onClick={() => toggleTask(task)}
                        className="flex items-start gap-2.5 text-left px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors"
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Circle size={16} className="text-muted mt-0.5 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${task.status === "completed" ? "text-muted line-through" : "text-text"}`}
                        >
                          {task.title}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border text-xs text-muted flex flex-col gap-1">
                    <span>
                      <span className="text-text">Project: </span>
                      {week.project}
                    </span>
                    <span>
                      <span className="text-text">Outcome: </span>
                      {week.outcome}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
