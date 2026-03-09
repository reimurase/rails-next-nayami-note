import { api } from "@/lib/api/client";
import { Issue, IssueInput } from "@/types/issue";

export const issueApi = {
  getIssues: async (): Promise<Issue[]> => {
    const res = await api.get<Issue[]>("/api/v1/issues");
    return res.data;
  },

  create: ({ title, content }: IssueInput) =>
    api.post("/api/v1/issues", {
      issue: { title, content },
    }),

  update: (id: number, { title, content }: IssueInput) =>
    api.patch(`/api/v1/issues/${id}`, {
      issue: { title, content },
    }),

  remove: (id: number) => api.delete(`/api/v1/issues/${id}`),
};
