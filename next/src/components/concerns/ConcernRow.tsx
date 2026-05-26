"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import ActionMenu from "@/components/common/ActionMenu";
import { concernApi } from "@/lib/api/concern";
import type { Concern } from "@/types/concern";

type Props = {
  concern: Concern;
  onConcernListChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
  onOpenDetail: () => void;
};

const TRIGGER_EVENT_LINE_LIMIT = 2;
const CONTENT_LINE_LIMIT = 3;

const ConcernRow = ({ concern, onConcernListChanged, onOpenDetail }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isArchived = concern.archivedAt !== null;

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      setIsProcessing(true);
      setApiError(null);
      await concernApi.remove(concern.id);
      onConcernListChanged?.();
    } catch (error) {
      console.error(error);
      setApiError("削除に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
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
      onConcernListChanged?.();
    } catch (error) {
      console.error(error);
      setApiError(isArchived ? "戻すのに失敗しました" : "移動に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div onClick={onOpenDetail} style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: TRIGGER_EVENT_LINE_LIMIT,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {concern.triggerEvent}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: CONTENT_LINE_LIMIT,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {concern.content}
        </Typography>
      </div>

      {apiError && (
        <Alert severity="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <ActionMenu
        actions={[
          {
            label: "詳細",
            onClick: onOpenDetail,
          },
          {
            label: isArchived ? "ノートへ戻す" : "ライブラリへ",
            onClick: handleArchive,
          },
          {
            label: "削除",
            onClick: handleDelete,
            color: "error.main",
          },
        ]}
        disabled={isProcessing}
      />
    </div>
  );
};

export default ConcernRow;
