"use client";

import type { Roadmap } from "@/lib/roadmapApi";

type Props = {
  roadmap: Roadmap;
};

const RoadmapRow = ({ roadmap }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>{roadmap.goal}</span>
      <span>{roadmap.content}</span>
    </div>
  );
};

export default RoadmapRow;
