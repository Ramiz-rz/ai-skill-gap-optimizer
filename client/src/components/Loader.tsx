import { Loader2 } from "lucide-react";

export function Loader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted py-8 justify-center">
      <Loader2 size={16} className="animate-spin text-accent-light" />
      {label}
    </div>
  );
}
