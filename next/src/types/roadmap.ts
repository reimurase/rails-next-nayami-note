export type RoadmapResponse = {
  id: number;
  goal: string;
  content: string;
  concern_id: number;
};

export type Roadmap = {
  id: number;
  goal: string;
  content: string;
  concernId: number;
};

export type RoadmapInput = {
  goal: string;
  content: string;
};
