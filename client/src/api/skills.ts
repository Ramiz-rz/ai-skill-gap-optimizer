import { api } from "./client";
import type { UserSkill, Proficiency } from "./types";

export const skillsApi = {
  list: () => api.get<UserSkill[]>("/skills"),
  create: (data: { name: string; category: string; proficiency: Proficiency }) =>
    api.post<UserSkill>("/skills", data),
  update: (id: string, data: Partial<{ proficiency: Proficiency; category: string; name: string }>) =>
    api.put<UserSkill>(`/skills/${id}`, data),
  remove: (id: string) => api.delete<{ deleted: boolean }>(`/skills/${id}`),
};
