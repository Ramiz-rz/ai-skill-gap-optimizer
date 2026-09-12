import { api } from "./client";
import type { Roadmap, Task } from "./types";

export const roadmapApi = {
  generate: (targetRole: string) =>
    api.post<{ roadmap: Roadmap; tasks: Task[] }>("/roadmap/generate", { targetRole }),
  current: () => api.get<{ roadmap: Roadmap | null; tasks: Task[] }>("/roadmap"),
};
