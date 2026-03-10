export type IssueResponse = {
  id: number;
  title: string;
  content: string;
  concern_id: number;
};

export type Issue = {
  id: number;
  title: string;
  content: string;
  concernId: number;
};

export type IssueInput = {
  title: string;
  content: string;
};
