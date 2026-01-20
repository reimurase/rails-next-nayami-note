import { api } from "./api";

type SignupParams = {
  email: string;
  password: string;
  password_confirmation: string;
};

type LoginParams = {
  email: string;
  password: string;
};

export const authApi = {
  signup: (params: SignupParams) => api.post("/api/v1/users", { user: params }),

  login: (params: LoginParams) => api.post("/api/v1/session", { session: params }),
  logout: () => api.delete("/api/v1/session"),

  me: () => api.get("/api/v1/me"),
};
