"use client";

import { useState } from "react";

import { roadmapApi } from "@/lib/api/roadmap";

type Props = {
  roadmapId: number;
  archivedAt: string | null;
  onArchiveChanged?: () => void | Promise<void>;
};

const RoadmapArchiveButton = ({ roadmapId, archivedAt, onArchiveChanged }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isArchived = archivedAt !== null;

  const handleClick = async () => {
    const ok = window.confirm(
      isArchived ? "本当にノートへ戻しますか？" : "本当にライブラリへ移動しますか？"
    );
    if (!ok) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      if (isArchived) {
        await roadmapApi.unarchiveRoadmap(roadmapId);
      } else {
        await roadmapApi.archiveRoadmap(roadmapId);
      }

      await onArchiveChanged?.();
    } catch (error) {
      console.error(error);
      setApiError(isArchived ? "戻すのに失敗しました" : "移動に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {apiError && (
        <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
          {apiError}
        </p>
      )}
      <button onClick={handleClick} disabled={isSubmitting}>
        {isSubmitting ? "移動中..." : isArchived ? "ノートへ戻す" : "ライブラリへ"}
      </button>
    </>
  );
};

export default RoadmapArchiveButton;
