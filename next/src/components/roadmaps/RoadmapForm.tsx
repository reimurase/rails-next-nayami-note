"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
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

type RoadmapFormProps = {
  concernId: number;
  onCreated: () => void;
};

const RoadmapForm = ({ concernId, onCreated }: RoadmapFormProps) => {
  const [goal, setGoal] = useState("");
  const [content, setContent] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<RoadmapErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { goal, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const goalError = serverErrors.goal ?? requiredErrors.goal ?? lengthErrors.goal;
  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.goal);
  const overContent = Boolean(lengthErrors.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    setIsSubmitting(true);

    try {
      await roadmapApi.create(concernId, values);

      setGoal("");
      setContent("");
      setSubmitted(false);
      onCreated();
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
      setApiError("保存に失敗しました。時間を置いて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {apiError && (
          <Alert severity="error" onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <TextField
          label="ゴール（任意）"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setServerErrors((prev) => ({ ...prev, goal: undefined }));
          }}
          multiline
          minRows={2}
          maxRows={4}
          fullWidth
          error={Boolean(goalError)}
          helperText={goalError ?? `${goal.length} / ${CONCERN_LIMITS.goal}`}
        />

        <TextField
          label="ロードマップ（必須）"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setServerErrors((prev) => ({ ...prev, content: undefined }));
          }}
          multiline
          minRows={5}
          maxRows={10}
          fullWidth
          error={Boolean(contentError)}
          helperText={contentError ?? `${content.length} / ${CONCERN_LIMITS.content}`}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || overTrigger || overContent}
          sx={{ alignSelf: "flex-end" }}
        >
          {isSubmitting ? "追加中..." : "追加"}
        </Button>
      </Stack>
    </Box>
  );
};

export default RoadmapForm;
