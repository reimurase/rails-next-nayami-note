import { IssueInput } from "./issue";
import { RoadmapInput } from "./roadmap";

export type ConcernResponse = {
  id: number;
  trigger_event: string;
  content: string;
};

export type Concern = {
  id: number;
  triggerEvent: string;
  content: string;
};

export type ConcernInput = Pick<Concern, "triggerEvent" | "content">;

export type ConcernDetailResponse = {
  concern: Concern;
  issue: IssueInput | null;
  roadmap: RoadmapInput | null;
};
