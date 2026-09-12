import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Landing } from "./pages/Landing";
import { Overview } from "./pages/Overview";
import { JobAnalysis } from "./pages/JobAnalysis";
import { MySkills } from "./pages/MySkills";
import { SkillGaps } from "./pages/SkillGaps";
import { RoadmapPage } from "./pages/RoadmapPage";
import { ProgressPage } from "./pages/ProgressPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="jobs" element={<JobAnalysis />} />
        <Route path="skills" element={<MySkills />} />
        <Route path="gaps" element={<SkillGaps />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}
