import { api } from "./client";
import type { ProgressData } from "./types";

export const progressApi = {
  get: () => api.get<ProgressData>("/progress"),
};
