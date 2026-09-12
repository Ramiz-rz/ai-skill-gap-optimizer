import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Sparkles } from "lucide-react";
import { jobsApi } from "../api/jobs";
import type { Job } from "../api/types";
import { ApiError } from "../api/client";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { FileSearch } from "lucide-react";
import { relevanceStyles } from "../lib/styles";
import { formatDate } from "../lib/styles";
import { DEMO_JOB } from "../data/demoJob";

export function JobAnalysis() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  async function loadJobs() {
    try {
      const list = await jobsApi.list();
      setJobs(list);
      if (list.length > 0 && !activeJob) setActiveJob(list[0]);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    loadJobs();
    if (searchParams.get("demo") === "1") {
      setJobTitle(DEMO_JOB.jobTitle);
      setCompany(DEMO_JOB.company);
      setDescription(DEMO_JOB.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadDemo() {
    setJobTitle(DEMO_JOB.jobTitle);
    setCompany(DEMO_JOB.company);
    setDescription(DEMO_JOB.description);
  }

  async function handleAnalyze() {
    setError(null);
    if (!jobTitle.trim() || !description.trim()) {
      setError("Job title and description are required.");
      return;
    }
    setAnalyzing(true);
    try {
      const job = await jobsApi.create({ jobTitle, company, description });
      setJobs((prev) => [job, ...prev]);
      setActiveJob(job);
      setJobTitle("");
      setCompany("");
      setDescription("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong analyzing this job.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete(id: string) {
    await jobsApi.remove(id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
    if (activeJob?._id === id) setActiveJob(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Analyze Job</h1>
        <p className="text-sm text-muted mt-1">
          Paste a job description to extract the technical skills it mentions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Job title</label>
            <input
              className="input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. AI/ML Engineer"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Company (optional)</label>
            <input
              className="input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Inc."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Job description</label>
            <textarea
              className="input min-h-[220px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job description here..."
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary flex items-center gap-2">
              <Sparkles size={14} />
              {analyzing ? "Analyzing job..." : "Analyze Job"}
            </button>
            <button onClick={loadDemo} className="btn-secondary">
              Try Demo Data
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-4">
            <p className="text-sm font-medium mb-3">Analyzed jobs ({jobs.length})</p>
            {loadingJobs ? (
              <Loader label="Loading jobs..." />
            ) : jobs.length === 0 ? (
              <p className="text-sm text-muted">No jobs analyzed yet.</p>
            ) : (
              <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setActiveJob(job)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeJob?._id === job._id ? "bg-accent/15 text-accent-light" : "hover:bg-surface-2 text-text"
                    }`}
                  >
                    <span className="truncate">
                      {job.jobTitle}
                      {job.company && <span className="text-muted"> · {job.company}</span>}
                    </span>
                    <Trash2
                      size={14}
                      className="text-muted hover:text-red-400 shrink-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job._id);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeJob ? (
              <motion.div
                key={activeJob._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{activeJob.jobTitle}</p>
                  <span className="text-xs text-muted">{formatDate(activeJob.createdAt)}</span>
                </div>
                <p className="text-xs text-muted mb-4">
                  {activeJob.detectedSkills.length} skills detected
                </p>

                <div className="flex flex-col gap-2">
                  {activeJob.detectedSkills.map((s) => (
                    <div
                      key={s.skill}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border"
                    >
                      <div>
                        <p className="text-sm">{s.skill}</p>
                        <p className="text-xs text-muted">
                          Mentioned {s.count} time{s.count !== 1 ? "s" : ""} · {s.category}
                        </p>
                      </div>
                      <span className={`chip ${relevanceStyles(s.relevance)}`}>{s.relevance}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <EmptyState
                icon={FileSearch}
                title="No job selected"
                description="Analyze a job or select one from the list to see detected skills."
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
