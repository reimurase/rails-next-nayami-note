import { api } from "./client";

import { SignupParams, LoginParams, Me, MeResponse } from "@/types/auth";

const toMe = (data: MeResponse): Me => ({
  id: data.id,
  email: data.email,
  autoArchiveEnabled: data.auto_archive_enabled,
});

export const authApi = {
  signup: (params: SignupParams) => api.post("/api/v1/users", { user: params }),

  login: (params: LoginParams) => api.post("/api/v1/session", { session: params }),

  guestLogin: () => api.post("/api/v1/guest_login"),

  logout: () => api.delete("/api/v1/session"),

  me: async (): Promise<Me> => {
    const res = await api.get<MeResponse>("/api/v1/me");
    return toMe(res.data);
  },

  updateAutoArchive: async (enabled: boolean): Promise<Me> => {
    const res = await api.patch<MeResponse>("/api/v1/me/auto_archive", {
      auto_archive_enabled: enabled,
    });
    return toMe(res.data);
  },
};

export const passwordApi = {
  resetRequest: (email: string) => api.post("/api/v1/password/reset_request", { email }),

  reset: (token: string, password: string) =>
    api.post("/api/v1/password/reset", { token, password }),
};
