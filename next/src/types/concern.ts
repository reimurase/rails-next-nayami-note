import { IssueInput } from "./issue";
import { RoadmapInput } from "./roadmap";

export type Concern = {
  id: number;
  trigger_event: string;
  content: string;
};

export type ConcernInput = {
  triggerEvent: string;
  content: string;
};

export type ConcernDetailResponse = {
  concern: Concern;
  issue: IssueInput | null;
  roadmap: RoadmapInput | null;
};
