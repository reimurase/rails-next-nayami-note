"use client";

import RoadmapDeleteButton from "./RoadmapDeleteButton";

import { Roadmap } from "@/types/roadmap";

type Props = {
  roadmap: Roadmap;
  onChanged?: () => void;
  onOpenDetail?: () => void;
};

const RoadmapRow = ({ roadmap, onChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div onClick={onOpenDetail} style={{ cursor: "pointer" }}>
        <span>{roadmap.goal}</span>
        <span>{roadmap.content}</span>
      </div>

      {/* 既存の削除ボタンはそのまま使える */}
      <RoadmapDeleteButton id={roadmap.id} onDeleted={onChanged} />
    </div>
  );
};

export default RoadmapRow;
