"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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

  const handleSaved = async () => {
    setIsEditing(false);
    await onConcernUpdated?.();
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "このなやみを削除すると、関連する問題やロードマップもすべて削除されます。よろしいですか？"
      )
    )
      return;
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
      await onConcernArchived?.();
    } catch (error) {
      console.error(error);
      setApiError(isArchived ? "戻すのに失敗しました" : "移動に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        なやみ
      </Typography>

      {apiError && (
        <Alert severity="error" onClose={() => setApiError(null)} sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" size="small" onClick={handleArchive} disabled={isProcessing}>
          {isArchived ? "ノートへ戻す" : "ライブラリへ"}
        </Button>

        {!isEditing && (
          <>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              削除
            </Button>

            <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
              編集
            </Button>
          </>
        )}
      </Stack>

      {isEditing ? (
        <ConcernEditor
          concern={concern}
          onSaved={handleSaved}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Box>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                きっかけ
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {concern.triggerEvent || "なし"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                内容
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {concern.content}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
