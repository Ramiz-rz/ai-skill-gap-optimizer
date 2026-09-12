import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  UserCog,
  Target,
  Map,
  TrendingUp,
  Settings,
  Github,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/jobs", label: "Job Analysis", icon: FileSearch },
  { to: "/dashboard/skills", label: "My Skills", icon: UserCog },
  { to: "/dashboard/gaps", label: "Skill Gaps", icon: Target },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/progress", label: "Progress", icon: TrendingUp },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center">
          <Sparkles size={15} className="text-accent-light" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Skill Optimizer</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-accent/15 text-accent-light"
                  : "text-muted hover:text-text hover:bg-surface-2"
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors duration-150"
        >
          <Settings size={16} />
          Settings
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors duration-150"
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </aside>
  );
}
