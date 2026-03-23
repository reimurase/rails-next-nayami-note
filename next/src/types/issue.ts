export type IssueResponse = {
  id: number;
  title: string;
  content: string;
  concern_id: number;
  archived_at: string | null;
};

export type Issue = {
  id: number;
  title: string;
  content: string;
  concernId: number;
  archivedAt: string | null;
};

export type IssueInput = {
  title: string;
  content: string;
};
