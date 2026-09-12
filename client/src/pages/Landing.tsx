import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileSearch, Target, Map as MapIcon } from "lucide-react";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="flex items-center gap-2 px-6 md:px-10 h-16 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center">
          <Sparkles size={15} className="text-accent-light" />
        </div>
        <span className="font-semibold text-sm">Skill Optimizer</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl"
        >
          Find the skills the market actually wants.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-muted mt-4 max-w-xl text-sm md:text-base"
        >
          Compare your current skills with real job requirements and turn the gaps into a
          practical learning plan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <button onClick={() => navigate("/dashboard/jobs")} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            Analyze My Skills <ArrowRight size={15} />
          </button>
          <button onClick={() => navigate("/dashboard/jobs?demo=1")} className="btn-secondary px-5 py-2.5">
            Try Demo Data
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-3 md:gap-6 mt-16 text-xs md:text-sm text-muted"
        >
          <PipelineStep icon={FileSearch} label="Jobs" />
          <Arrow />
          <PipelineStep icon={Sparkles} label="Skills" />
          <Arrow />
          <PipelineStep icon={Target} label="Gaps" />
          <Arrow />
          <PipelineStep icon={MapIcon} label="Roadmap" />
        </motion.div>
      </main>
    </div>
  );
}

function PipelineStep({ icon: Icon, label }: { icon: typeof FileSearch; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-lg border border-border bg-surface flex items-center justify-center">
        <Icon size={16} className="text-accent-light" />
      </div>
      <span>{label}</span>
    </div>
  );
}

function Arrow() {
  return <div className="w-6 h-px bg-border" />;
}
