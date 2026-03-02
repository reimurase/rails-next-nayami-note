export type Issue = {
  id: number;
  title: string;
  content: string;
};

export type IssueInput = Pick<Issue, "title" | "content">;
