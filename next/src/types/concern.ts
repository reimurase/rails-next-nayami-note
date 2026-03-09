import { Issue } from "./issue";
import { Roadmap } from "./roadmap";

export type ConcernResponse = {
  id: number;
  trigger_event: string;
  content: string;
};

export type ConcernDetailResponse = {
  concern: ConcernResponse;
  issue: Issue | null;
  roadmap: Roadmap | null;
};

export type Concern = {
  id: number;
  triggerEvent: string;
  content: string;
};

export type ConcernInput = Pick<Concern, "triggerEvent" | "content">;

export type ConcernDetail = {
  concern: Concern;
  issue: Issue | null;
  roadmap: Roadmap | null;
};
