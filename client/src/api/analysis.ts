import { api } from "./client";
import type { LatestAnalysis } from "./types";

export const analysisApi = {
  latest: () => api.get<LatestAnalysis>("/analysis/latest"),
};
