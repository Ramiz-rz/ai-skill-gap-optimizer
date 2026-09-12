import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { progressApi } from "../api/progress";
import type { ProgressData } from "../api/types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { CheckCircle2, ListTodo, Sparkles } from "lucide-react";

export function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    progressApi
      .get()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your progress..." />;

  if (!data || !data.hasRoadmap) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No progress yet"
        description="Your progress history will appear here as you complete roadmap tasks."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Progress</h1>
        <p className="text-sm text-muted mt-1">Tracking your roadmap for {data.targetRole}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Overall Progress" value={`${data.overallProgress}%`} icon={TrendingUp} />
        <MetricCard label="Completed Tasks" value={`${data.completedTasks}`} icon={CheckCircle2} />
        <MetricCard label="Remaining Tasks" value={`${data.remainingTasks}`} icon={ListTodo} />
      </div>

      <div className="card p-5">
        <p className="text-sm font-medium mb-2">Skills improved</p>
        {data.skillsImproved.length === 0 ? (
          <p className="text-xs text-muted">Complete a task to see skills show up here.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.skillsImproved.map((skill) => (
              <span key={skill} className="chip border-accent/40 bg-accent/10 text-accent-light">
                <Sparkles size={12} /> {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <p className="text-sm font-medium mb-4">Weekly activity</p>
        {data.weeklyActivity.length === 0 ? (
          <p className="text-xs text-muted">Your progress history will appear here as you complete roadmap tasks.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23262D" vertical={false} />
                <XAxis dataKey="week" stroke="#9AA1AC" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9AA1AC" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#15171C", border: "1px solid #23262D", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="tasksCompleted" fill="#8C56D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
