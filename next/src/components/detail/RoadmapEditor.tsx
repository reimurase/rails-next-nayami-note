"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
import type { Roadmap } from "@/types/roadmap";
import { roadmapApi } from "@/lib/api/roadmap";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type RoadmapErrors,
  mapRoadmapValidationErrors,
} from "@/lib/validations/roadmapValidation";

type Props = {
  concernId: number;
  roadmap: Roadmap;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function RoadmapEditor({ concernId, roadmap, onSaved, onCancel }: Props) {
  const [goal, setGoal] = useState(roadmap.goal || "");
  const [content, setContent] = useState(roadmap.content || "");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<RoadmapErrors>({});

  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { goal, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const goalError = serverErrors.goal ?? requiredErrors.goal ?? lengthErrors.goal;
  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overGoal = Boolean(lengthErrors.goal);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await roadmapApi.update(concernId, { goal, content });

      setSubmitted(false);

      await onSaved?.();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapRoadmapValidationErrors(appError.errors));
        return;
      }

      if (appError.type === "network") {
        setApiError(appError.message);
        return;
      }

      console.error(error);
      setApiError("更新に失敗しました。時間を置いて再度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        label="ゴール（任意）"
        fullWidth
        multiline
        minRows={3}
        maxRows={5}
        value={goal}
        placeholder="目指すゴールはどこか"
        onChange={(e) => {
          setGoal(e.target.value);
          setServerErrors((prev) => ({ ...prev, goal: undefined }));
        }}
        disabled={isSaving}
        error={Boolean(goalError)}
        helperText={goalError || `${goal.length}/${CONCERN_LIMITS.goal}`}
        slotProps={{
          formHelperText: {
            sx: goalError ? undefined : { textAlign: "right" },
          },
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="進め方（必須）"
        fullWidth
        multiline
        minRows={3}
        maxRows={12}
        value={content}
        placeholder="ゴールまでにどんな問題があるか書いていこう"
        onChange={(e) => {
          setContent(e.target.value);
          setServerErrors((prev) => ({ ...prev, content: undefined }));
        }}
        disabled={isSaving}
        error={Boolean(contentError)}
        helperText={contentError || `${content.length}/${CONCERN_LIMITS.content}`}
        slotProps={{
          formHelperText: {
            sx: contentError ? undefined : { textAlign: "right" },
          },
        }}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button variant="text" onClick={onCancel} disabled={isSaving}>
          キャンセル
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || overGoal || overContent}
        >
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </Stack>
    </Box>
  );
}
