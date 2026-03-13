"use client";

import { useState } from "react";

import type { Roadmap } from "@/types/roadmap";
import { roadmapApi } from "@/lib/api/roadmap";

type Props = {
  concernId: number;
  roadmap: Roadmap;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function RoadmapEditor({ concernId, roadmap, onSaved, onCancel }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [goal, setTitle] = useState(roadmap.goal || "");
  const [content, setContent] = useState(roadmap.content || "");

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await roadmapApi.update(concernId, { goal, content });
      await onSaved?.();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <textarea
        value={goal}
        placeholder="ゴール（任意）"
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
      />

      <textarea
        value={content}
        placeholder="ロードマップ（必須）"
        onChange={(e) => setContent(e.target.value)}
        disabled={isSaving}
      />

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "保存中..." : "保存"}
      </button>

      <button onClick={onCancel} disabled={isSaving}>
        キャンセル
      </button>
    </div>
  );
}
