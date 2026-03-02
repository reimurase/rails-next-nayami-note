import { api } from "./api";

import { SignupParams, LoginParams } from "@/types/auth";

export const authApi = {
  signup: (params: SignupParams) => api.post("/api/v1/users", { user: params }),

  login: (params: LoginParams) => api.post("/api/v1/session", { session: params }),

  logout: () => api.delete("/api/v1/session"),

  me: () => api.get("/api/v1/me"),
};
