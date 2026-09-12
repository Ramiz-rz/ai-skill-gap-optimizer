import { api } from "./client";
import type { Task, TaskStatus } from "./types";

export const tasksApi = {
  updateStatus: (id: string, status: TaskStatus) => api.put<Task>(`/tasks/${id}`, { status }),
};
