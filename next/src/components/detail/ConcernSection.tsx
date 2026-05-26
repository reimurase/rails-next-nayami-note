"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";

import ConcernEditor from "./ConcernEditor";

import { concernApi } from "@/lib/api/concern";
import type { Concern } from "@/types/concern";

type Props = {
  concern: Concern;
  onConcernUpdated?: () => void | Promise<void>;
  onConcernDeleted?: () => void | Promise<void>;
  onConcernArchived?: () => void | Promise<void>;
};

export default function ConcernSection({
  concern,
  onConcernUpdated,
  onConcernDeleted,
  onConcernArchived,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isArchived = concern.archivedAt !== null;

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleSaved = async () => {
    setIsEditing(false);
    await onConcernUpdated?.();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      setIsProcessing(true);
      setApiError(null);
      await concernApi.remove(concern.id);
      await onConcernDeleted?.();
    } catch (error) {
      console.error(error);
      setApiError("削除に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (
      !window.confirm(
        isArchived ? "本当にノートへ戻しますか？" : "本当にライブラリへ移動しますか？"
      )
    )
      return;
    try {
      setIsProcessing(true);
      setApiError(null);
      if (isArchived) {
        await concernApi.unarchiveConcern(concern.id);
      } else {
        await concernApi.archiveConcern(concern.id);
      }
      await onConcernArchived?.();
    } catch (error) {
      console.error(error);
      setApiError(isArchived ? "戻すのに失敗しました" : "移動に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h3>Concern</h3>

      {apiError && (
        <Alert severity="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <button onClick={handleArchiveToggle} disabled={isProcessing}>
        {isArchived ? "ノートへ戻す" : "ライブラリへ"}
      </button>

      {isEditing ? (
        <ConcernEditor concern={concern} onSaved={handleSaved} onCancel={handleCancelEdit} />
      ) : (
        <div>
          <ul>
            <li>きっかけ: {concern.triggerEvent || "なし"}</li>
            <li>内容: {concern.content || "なし"}</li>
          </ul>

          <button onClick={startEditing}>編集</button>
          <button onClick={handleDelete} disabled={isProcessing} style={{ color: "tomato" }}>
            削除
          </button>
        </div>
      )}
    </div>
  );
}
