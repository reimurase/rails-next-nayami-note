"use client";

import { useState } from "react";

import RoadmapCreateSheet from "../roadmaps/RoadmapCreateSheet";
import RoadmapDeleteButton from "../roadmaps/RoadmapDeleteButton";
import RoadmapArchiveButton from "../roadmaps/RoadmapArchiveButton";

import RoadmapEditor from "./RoadmapEditor";

import type { Roadmap } from "@/types/roadmap";

type Props = {
  concernId: number;
  roadmap: Roadmap | null;
  onRoadmapChanged?: () => void | Promise<void>;
};

export default function RoadmapSection({ concernId, roadmap, onRoadmapChanged }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    if (!roadmap) return;
    setIsEditing(true);
  };

  const handleSaved = async () => {
    setIsEditing(false);

    // roadmapページ / 詳細のroadmapを更新
    await onRoadmapChanged?.();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCreated = async () => {
    setIsSheetOpen(false);

    // roadmapページ / 詳細のroadmapを更新
    await onRoadmapChanged?.();
  };

  return (
    <div>
      <h3>Roadmap</h3>

      {!roadmap ? (
        <div>
          <p>roadmap はありません</p>
          <button onClick={() => setIsSheetOpen(true)}>新規作成</button>

          <RoadmapCreateSheet
            concernId={concernId}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onCreated={handleCreated}
          />
        </div>
      ) : isEditing ? (
        <RoadmapEditor
          concernId={concernId}
          roadmap={roadmap}
          onSaved={handleSaved}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          <RoadmapArchiveButton
            roadmapId={roadmap.id}
            archivedAt={roadmap.archivedAt}
            onArchiveChanged={onRoadmapChanged}
          />
          <ul>
            <li>タイトル: {roadmap.goal || "なし"}</li>
            <li>内容: {roadmap.content || "なし"}</li>
          </ul>

          <button onClick={startEditing}>編集</button>
          <RoadmapDeleteButton concernId={concernId} onDeleted={onRoadmapChanged} />
        </div>
      )}
    </div>
  );
}
