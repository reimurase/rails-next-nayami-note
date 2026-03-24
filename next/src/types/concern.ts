import { Issue, IssueResponse } from "./issue";
import { Roadmap } from "./roadmap";

export type ConcernResponse = {
  id: number;
  trigger_event: string;
  content: string;
  archived_at: string | null;
};

export type ConcernDetailResponse = {
  concern: ConcernResponse;
  issue: IssueResponse | null;
  roadmap: Roadmap | null;
};

export type Concern = {
  id: number;
  triggerEvent: string;
  content: string;
  archivedAt: string | null;
};

export type ConcernInput = {
  triggerEvent: string;
  content: string;
};

export type ConcernDetail = {
  concern: Concern;
  issue: Issue | null;
  roadmap: Roadmap | null;
};
