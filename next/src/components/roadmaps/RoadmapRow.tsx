"use client";

import RoadmapDeleteButton from "./RoadmapDeleteButton";

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

      {/* 既存の削除ボタンはそのまま使える */}
      <RoadmapDeleteButton concernId={roadmap.concernId} onDeleted={onRoadmapListChanged} />
    </div>
  );
};

export default RoadmapRow;
