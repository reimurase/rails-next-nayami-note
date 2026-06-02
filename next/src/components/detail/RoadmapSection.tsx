"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RoadmapForm from "../roadmaps/RoadmapForm";

import RoadmapEditor from "./RoadmapEditor";

import { roadmapApi } from "@/lib/api/roadmap";
import type { Roadmap } from "@/types/roadmap";

type Props = {
  concernId: number;
  roadmap: Roadmap | null;
  onRoadmapChanged?: () => void | Promise<void>;
};

export default function RoadmapSection({ concernId, roadmap, onRoadmapChanged }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isArchived = roadmap?.archivedAt !== null;

  const handleSaved = async () => {
    setIsEditing(false);

    // roadmapページ / 詳細のroadmapを更新
    await onRoadmapChanged?.();
  };

  const handleCreated = async () => {
    setIsCreating(false);

    // roadmapページ / 詳細のroadmapを更新
    await onRoadmapChanged?.();
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      setIsProcessing(true);
      setApiError(null);
      await roadmapApi.remove(concernId);
      await onRoadmapChanged?.();
    } catch (error) {
      console.error(error);
      setApiError("削除に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    if (!roadmap) return;
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
        await roadmapApi.unarchiveRoadmap(roadmap.id);
      } else {
        await roadmapApi.archiveRoadmap(roadmap.id);
      }
      await onRoadmapChanged?.();
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
        ロードマップ
      </Typography>

      {!roadmap ? (
        <>
          {!isCreating ? (
            <Box>
              <Typography sx={{ mb: 1 }}>ロードマップはありません</Typography>
              <Button variant="outlined" size="small" onClick={() => setIsCreating(true)}>
                新規作成
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <RoadmapForm concernId={concernId} onCreated={handleCreated} />
            </Box>
          )}
        </>
      ) : (
        <>
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
            <RoadmapEditor
              concernId={concernId}
              roadmap={roadmap}
              onSaved={handleSaved}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ゴール
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {roadmap.goal || "なし"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  内容
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {roadmap.content}
                </Typography>
              </Box>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
