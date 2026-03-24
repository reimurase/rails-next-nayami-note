"use client";

import RoadmapDeleteButton from "./RoadmapDeleteButton";
import RoadmapArchiveButton from "./RoadmapArchiveButton";

import { Roadmap } from "@/types/roadmap";

type Props = {
  roadmap: Roadmap;
  onRoadmapListChanged?: () => void;
  onOpenDetail?: () => void;
};

const RoadmapRow = ({ roadmap, onRoadmapListChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div onClick={onOpenDetail} style={{ cursor: "pointer" }}>
        <span>{roadmap.goal}</span>
        <span>{roadmap.content}</span>
      </div>

      <RoadmapDeleteButton concernId={roadmap.concernId} onDeleted={onRoadmapListChanged} />

      <RoadmapArchiveButton
        roadmapId={roadmap.id}
        archivedAt={roadmap.archivedAt}
        onArchiveChanged={onRoadmapListChanged}
      />
    </div>
  );
};

export default RoadmapRow;
