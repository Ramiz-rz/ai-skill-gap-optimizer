import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import {
  LayoutDashboard,
  FileSearch,
  UserCog,
  Target,
  Map,
  TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/jobs", label: "Job Analysis", icon: FileSearch },
  { to: "/dashboard/skills", label: "My Skills", icon: UserCog },
  { to: "/dashboard/gaps", label: "Skill Gaps", icon: Target },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/progress", label: "Progress", icon: TrendingUp },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
            <Sparkles size={13} className="text-accent-light" />
          </div>
          <span className="font-semibold text-sm">Skill Optimizer</span>
        </div>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-muted hover:text-text"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-3 pb-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                  isActive ? "bg-accent/15 text-accent-light" : "text-muted"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
