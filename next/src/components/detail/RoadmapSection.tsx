"use client";

import { useState } from "react";

import RoadmapCreateSheet from "../roadmaps/RoadmapCreateSheet";

import type { Roadmap } from "@/types/roadmap";

type Props = {
  concernId: number;
  roadmap: Roadmap | null;
  onRoadmapChanged?: () => void | Promise<void>;
};

export default function RoadmapSection({ concernId, roadmap, onRoadmapChanged }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
      ) : (
        <div>
          <ul>
            <li>タイトル: {roadmap.goal || "なし"}</li>
            <li>内容: {roadmap.content || "なし"}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
