export type Proficiency = "Beginner" | "Intermediate" | "Advanced";
export type Relevance = "High" | "Medium" | "Low";
export type GapStatus = "matched" | "partial" | "missing";
export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "pending" | "completed";

export interface DetectedSkill {
  skill: string;
  category: string;
  count: number;
  relevance: Relevance;
}

export interface Job {
  _id: string;
  jobTitle: string;
  company: string;
  description: string;
  detectedSkills: DetectedSkill[];
  createdAt: string;
}

export interface UserSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: Proficiency;
}

export interface MarketSkill {
  skill: string;
  category: string;
  jobsMentioningCount: number;
  totalJobs: number;
  frequencyPercent: number;
}

export interface LatestAnalysis {
  totalJobs: number;
  marketSkills: MarketSkill[];
  message?: string;
}

export interface GapItem {
  skill: string;
  category: string;
  status: GapStatus;
  frequencyPercent: number;
  userProficiency?: Proficiency;
  priority?: Priority;
}

export interface GapResult {
  matchScore: number;
  matched: GapItem[];
  partial: GapItem[];
  missing: GapItem[];
  totalJobsAnalyzed: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  focus: string;
  skills: string[];
  project: string;
  outcome: string;
}

export interface Roadmap {
  _id: string;
  targetRole: string;
  title: string;
  explanation: string;
  source: "ai" | "fallback";
  weeks: RoadmapWeek[];
  active: boolean;
  createdAt: string;
}

export interface Task {
  _id: string;
  roadmapId: string;
  weekNumber: number;
  title: string;
  skill: string;
  status: TaskStatus;
  completedAt: string | null;
}

export interface ProgressData {
  hasRoadmap: boolean;
  targetRole?: string;
  overallProgress: number;
  completedTasks: number;
  remainingTasks: number;
  skillsImproved: string[];
  weeklyActivity: { week: string; tasksCompleted: number }[];
}
