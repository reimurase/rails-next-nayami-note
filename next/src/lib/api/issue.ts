import { api } from "@/lib/api/client";
import { IssueResponse, Issue, IssueInput } from "@/types/issue";

export const toIssue = (data: IssueResponse): Issue => ({
  id: data.id,
  title: data.title,
  content: data.content,
  concernId: data.concern_id,
  archivedAt: data.archived_at,
});

export const issueApi = {
  getIssues: async (): Promise<Issue[]> => {
    const res = await api.get<IssueResponse[]>("/api/v1/issues");
    return res.data.map(toIssue);
  },

  create: async (concernId: number, input: IssueInput): Promise<Issue> => {
    const res = await api.post<IssueResponse>(`/api/v1/concerns/${concernId}/issue`, {
      issue: input,
    });
    return toIssue(res.data);
  },

  update: async (concernId: number, input: IssueInput): Promise<Issue> => {
    const res = await api.patch(`/api/v1/concerns/${concernId}/issue`, {
      issue: input,
    });
    return toIssue(res.data);
  },

  remove: (concernId: number) => api.delete(`/api/v1/concerns/${concernId}/issue`),

  getArchivedIssues: async (): Promise<Issue[]> => {
    const res = await api.get<IssueResponse[]>("/api/v1/issues/archived");
    return res.data.map(toIssue);
  },

  archiveIssue: async (issueId: number): Promise<void> => {
    await api.patch<IssueResponse>(`/api/v1/issues/${issueId}/archive`);
  },

  unarchiveIssue: async (issueId: number): Promise<void> => {
    await api.patch<IssueResponse>(`/api/v1/issues/${issueId}/unarchive`);
  },
};
