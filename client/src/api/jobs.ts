import { api } from "./client";
import type { Job } from "./types";

export const jobsApi = {
  list: () => api.get<Job[]>("/jobs"),
  create: (data: { jobTitle: string; company?: string; description: string }) =>
    api.post<Job>("/jobs", data),
  remove: (id: string) => api.delete<{ deleted: boolean }>(`/jobs/${id}`),
};
