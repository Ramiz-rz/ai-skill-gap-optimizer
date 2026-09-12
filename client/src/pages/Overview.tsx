import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, ListX, AlertTriangle, Map as MapIcon } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { EmptyState } from "../components/EmptyState";
import { Loader } from "../components/Loader";
import { analysisApi } from "../api/analysis";
import { gapsApi } from "../api/gaps";
import { progressApi } from "../api/progress";
import type { LatestAnalysis, GapResult, ProgressData } from "../api/types";
import { ApiError } from "../api/client";

export function Overview() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<LatestAnalysis | null>(null);
  const [gaps, setGaps] = useState<GapResult | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const latest = await analysisApi.latest();
        setAnalysis(latest);

        if (latest.totalJobs > 0) {
          try {
            const gapResult = await gapsApi.analyze();
            setGaps(gapResult);
          } catch {
            // No skills yet or python service down; leave gaps null, UI handles it.
          }
        }

        const prog = await progressApi.get();
        setProgress(prog);
      } catch (err) {
        // Surfaced via empty states below.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading your overview..." />;

  const hasJobs = (analysis?.totalJobs || 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Your Skill Overview</h1>
        <p className="text-sm text-muted mt-1">
          A quick look at how your skills compare to the roles you are targeting.
        </p>
      </div>

      {!hasJobs ? (
        <EmptyState
          icon={ListX}
          title="No analysis yet"
          description="Add a job description to see where your skills stand."
          action={
            <Link to="/dashboard/jobs" className="btn-primary">
              Analyze a job
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Skill Match"
            value={gaps ? `${gaps.matchScore}%` : "--"}
            icon={Target}
            hint={gaps ? `Based on ${gaps.totalJobsAnalyzed} analyzed job(s)` : "Add skills to see your match"}
          />
          <MetricCard
            label="Missing Skills"
            value={gaps ? `${gaps.missing.length}` : "--"}
            icon={ListX}
          />
          <MetricCard
            label="Priority Gaps"
            value={gaps ? `${gaps.missing.filter((m) => m.priority === "High").length}` : "--"}
            icon={AlertTriangle}
            hint="High priority missing skills"
          />
          <MetricCard
            label="Roadmap Progress"
            value={progress?.hasRoadmap ? `${progress.overallProgress}%` : "--"}
            icon={MapIcon}
            hint={progress?.hasRoadmap ? undefined : "No roadmap yet"}
          />
        </div>
      )}
    </div>
  );
}
