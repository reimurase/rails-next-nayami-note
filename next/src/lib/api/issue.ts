import { api } from "@/lib/api/client";
import { IssueResponse, Issue, IssueInput } from "@/types/issue";

const toIssue = (data: IssueResponse): Issue => ({
  id: data.id,
  title: data.title,
  content: data.content,
  concernId: data.concern_id,
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

  update: (id: number, { title, content }: IssueInput) =>
    api.patch(`/api/v1/issues/${id}`, {
      issue: { title, content },
    }),

  remove: (id: number) => api.delete(`/api/v1/issues/${id}`),
};
