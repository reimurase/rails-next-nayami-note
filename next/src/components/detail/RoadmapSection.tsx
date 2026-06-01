"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RoadmapArchiveButton from "../roadmaps/RoadmapArchiveButton";
import RoadmapDeleteButton from "../roadmaps/RoadmapDeleteButton";
import RoadmapForm from "../roadmaps/RoadmapForm";

import RoadmapEditor from "./RoadmapEditor";

import type { Roadmap } from "@/types/roadmap";

type Props = {
  concernId: number;
  roadmap: Roadmap | null;
  onRoadmapChanged?: () => void | Promise<void>;
  onRoadmapArchived?: () => void | Promise<void>;
};

export default function RoadmapSection({
  concernId,
  roadmap,
  onRoadmapChanged,
  onRoadmapArchived,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
            <RoadmapForm concernId={concernId} onCreated={handleCreated} />
          )}
        </>
      ) : isEditing ? (
        <RoadmapEditor
          concernId={concernId}
          roadmap={roadmap}
          onSaved={handleSaved}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <RoadmapArchiveButton
              roadmapId={roadmap.id}
              archivedAt={roadmap.archivedAt}
              onArchiveChanged={onRoadmapArchived}
            />
            <RoadmapDeleteButton concernId={concernId} onDeleted={onRoadmapChanged} />
            <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
              編集
            </Button>
          </Stack>

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
        </Box>
      )}
    </Box>
  );
}
