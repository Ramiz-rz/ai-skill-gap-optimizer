import { api } from "./client";
import type { GapResult } from "./types";

export const gapsApi = {
  analyze: () => api.post<GapResult>("/gaps"),
};
