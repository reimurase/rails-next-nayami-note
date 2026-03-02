export type Roadmap = {
  id: number;
  goal: string;
  content: string;
};

export type RoadmapInput = Pick<Roadmap, "goal" | "content">;
