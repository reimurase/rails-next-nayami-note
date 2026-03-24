export type RoadmapResponse = {
  id: number;
  goal: string;
  content: string;
  concern_id: number;
  archived_at: string | null;
};

export type Roadmap = {
  id: number;
  goal: string;
  content: string;
  concernId: number;
  archivedAt: string | null;
};

export type RoadmapInput = {
  goal: string;
  content: string;
};
