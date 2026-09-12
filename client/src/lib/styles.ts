export function relevanceStyles(level: "High" | "Medium" | "Low") {
  switch (level) {
    case "High":
      return "border-accent/40 bg-accent/10 text-accent-light";
    case "Medium":
      return "border-cyan/30 bg-cyan/10 text-cyan";
    default:
      return "border-border bg-surface-2 text-muted";
  }
}

export function priorityStyles(level: "High" | "Medium" | "Low") {
  switch (level) {
    case "High":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    case "Medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    default:
      return "border-border bg-surface-2 text-muted";
  }
}

export function statusStyles(status: "matched" | "partial" | "missing") {
  switch (status) {
    case "matched":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "partial":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    default:
      return "border-red-500/30 bg-red-500/10 text-red-400";
  }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
