import { api } from "@/lib/api";

export type Issue = {
  title: string;
  content: string;
};

type CreateIssueParams = {
  title: string;
  content: string;
};

type UpdateIssueParams = {
  id: number;
  title: string;
  content: string;
};

type GetIssueParams = {
  id: number;
};

type DeleteIssueParams = {
  id: number;
};

export const IssueApi = {
  getIssues: async (): Promise<Issue[]> => {
    const res = await api.get<Issue[]>("/api/v1/issues");
    return res.data;
  },

  getIssue: async ({ id }: GetIssueParams): Promise<Issue> => {
    const res = await api.get<Issue>(`/api/v1/issues/${id}`);
    return res.data;
  },

  create: ({ title, content }: CreateIssueParams) =>
    api.post("/api/v1/issues", {
      issue: { title, content },
    }),

  update: ({ id, title, content }: UpdateIssueParams) =>
    api.patch(`/api/v1/issues/${id}`, {
      issue: { title, content },
    }),

  remove: ({ id }: DeleteIssueParams) => api.delete(`/api/v1/issues/${id}`),
};
