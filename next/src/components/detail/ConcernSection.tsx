"use client";

import { useState } from "react";

import ConcernEditor from "./ConcernEditor";

import type { Concern } from "@/types/concern";

type Props = {
  concernId: number;
  concern: Concern;
  onConcernChanged?: () => void | Promise<void>;
};

export default function ConcernSection({ concernId, concern, onConcernChanged }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleSaved = async () => {
    setIsEditing(false);

    // concernページ / 詳細のconcernを更新
    await onConcernChanged?.();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <h3>Concern</h3>

      {isEditing ? (
        <ConcernEditor
          concernId={concernId}
          concern={concern}
          onSaved={handleSaved}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          <ul>
            <li>きっかけ: {concern.triggerEvent || "なし"}</li>
            <li>内容: {concern.content || "なし"}</li>
          </ul>

          <button onClick={startEditing}>編集</button>
        </div>
      )}
    </div>
  );
}
