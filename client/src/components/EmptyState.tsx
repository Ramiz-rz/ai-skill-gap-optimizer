import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center justify-center text-center gap-3 py-14 px-6">
      <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center">
        <Icon size={18} className="text-muted" />
      </div>
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}
