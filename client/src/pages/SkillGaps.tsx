import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gapsApi } from "../api/gaps";
import type { GapResult } from "../api/types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { Target } from "lucide-react";
import { ApiError } from "../api/client";
import { statusStyles, priorityStyles } from "../lib/styles";

export function SkillGaps() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<GapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gapsApi
      .analyze()
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not analyze gaps."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Comparing your skills to the market..." />;

  if (error || !result) {
    return (
      <EmptyState
        icon={Target}
        title="No gap analysis yet"
        description={error || "Analyze a job and add your skills first."}
      />
    );
  }

  const high = result.missing.filter((m) => m.priority === "High");
  const medium = result.missing.filter((m) => m.priority === "Medium");
  const low = result.missing.filter((m) => m.priority === "Low");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Skill Gaps</h1>
        <p className="text-sm text-muted mt-1">
          Based on {result.totalJobsAnalyzed} analyzed job{result.totalJobsAnalyzed !== 1 ? "s" : ""}.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex items-center gap-6"
      >
        <div className="text-4xl font-semibold text-accent-light">{result.matchScore}%</div>
        <div>
          <p className="text-sm font-medium">Overall match score</p>
          <p className="text-xs text-muted mt-1 max-w-md">
            Weighted by how often each skill appears across analyzed job postings. Matched skills
            count fully, partial (Beginner level) skills count half, missing skills count as zero.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GapColumn title="Matched" items={result.matched} status="matched" />
        <GapColumn title="Partial" items={result.partial} status="partial" />
        <GapColumn title="Missing" items={result.missing} status="missing" />
      </div>

      <div className="card p-5">
        <p className="text-sm font-medium mb-4">Missing skills by priority</p>
        {result.totalJobsAnalyzed === 1 && (
          <p className="text-xs text-muted mb-3">
            Result is based on a single analyzed job. Add more jobs for a stronger signal.
          </p>
        )}
        <PriorityGroup label="High Priority" items={high} />
        <PriorityGroup label="Medium Priority" items={medium} />
        <PriorityGroup label="Low Priority" items={low} />
      </div>
    </div>
  );
}

function GapColumn({
  title,
  items,
  status,
}: {
  title: string;
  items: GapResult["matched"];
  status: "matched" | "partial" | "missing";
}) {
  return (
    <div className="card p-4">
      <p className="text-sm font-medium mb-3">
        {title} <span className="text-muted font-normal">({items.length})</span>
      </p>
      {items.length === 0 ? (
        <p className="text-xs text-muted">Nothing here yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.skill} className={`chip w-full justify-between ${statusStyles(status)}`}>
              <span>{item.skill}</span>
              <span>{item.frequencyPercent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityGroup({ label, items }: { label: string; items: GapResult["missing"] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs text-muted mb-2">{label}</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.skill}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border"
          >
            <span className="text-sm">{item.skill}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Appears in {item.frequencyPercent}% of analyzed jobs</span>
              <span className={`chip ${priorityStyles(item.priority || "Low")}`}>{item.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
