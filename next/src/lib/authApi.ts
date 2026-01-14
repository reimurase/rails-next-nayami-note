import { api } from "./api";

type AuthParams = {
  email: string;
  password: string;
};

export const authApi = {
  signup: (params: AuthParams) => api.post("/api/v1/users", { user: params }),

  login: (params: AuthParams) => api.post("/api/v1/session", { session: params }),
};
