import { Issue, IssueResponse } from "./issue";
import { Roadmap, RoadmapResponse } from "./roadmap";

export type ConcernResponse = {
  id: number;
  trigger_event: string;
  content: string;
  archived_at: string | null;
  created_at: string;
};

export type ConcernDetailResponse = {
  concern: ConcernResponse;
  issue: IssueResponse | null;
  roadmap: RoadmapResponse | null;
};

export type Concern = {
  id: number;
  triggerEvent: string;
  content: string;
  archivedAt: string | null;
  createdAt: string;
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
