"use client";

import { useState } from "react";

import ConcernDeleteButton from "../concerns/ConcernDeleteButton";

import ConcernEditor from "./ConcernEditor";

import type { Concern } from "@/types/concern";

type Props = {
  concern: Concern;
  onConcernUpdated?: () => void | Promise<void>;
  onConcernDeleted?: () => void | Promise<void>;
};

export default function ConcernSection({ concern, onConcernUpdated, onConcernDeleted }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleSaved = async () => {
    setIsEditing(false);

    // concernページ / 詳細のconcernを更新
    await onConcernUpdated?.();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleConcernDeleted = async () => {
    await onConcernDeleted?.();
  };

  return (
    <div>
      <h3>Concern</h3>

      {isEditing ? (
        <ConcernEditor concern={concern} onSaved={handleSaved} onCancel={handleCancelEdit} />
      ) : (
        <div>
          <ul>
            <li>きっかけ: {concern.triggerEvent || "なし"}</li>
            <li>内容: {concern.content || "なし"}</li>
          </ul>

          <button onClick={startEditing}>編集</button>
          <ConcernDeleteButton
            id={concern.id}
            onDeleted={handleConcernDeleted} // 削除成功時も一覧更新
          />
        </div>
      )}
    </div>
  );
}
