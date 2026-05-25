"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
import type { Issue } from "@/types/issue";
import { issueApi } from "@/lib/api/issue";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type IssueErrors,
  mapIssueValidationErrors,
} from "@/lib/validations/issueValidation";

type Props = {
  concernId: number;
  issue: Issue;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function IssueEditor({ concernId, issue, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(issue.title || "");
  const [content, setContent] = useState(issue.content || "");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<IssueErrors>({});

  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { title, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const titleError = serverErrors.title ?? requiredErrors.title ?? lengthErrors.title;
  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTitle = Boolean(lengthErrors.title);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await issueApi.update(concernId, { title, content });

      setSubmitted(false);

      await onSaved?.();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapIssueValidationErrors(appError.errors));
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
        label="タイトル（任意）"
        fullWidth
        multiline
        minRows={3}
        maxRows={5}
        value={title}
        placeholder="タイトル"
        onChange={(e) => {
          setTitle(e.target.value);
          setServerErrors((prev) => ({ ...prev, title: undefined }));
        }}
        disabled={isSaving}
        error={Boolean(titleError)}
        helperText={titleError || `${title.length}/${CONCERN_LIMITS.title}`}
        slotProps={{
          formHelperText: {
            sx: titleError ? undefined : { textAlign: "right" },
          },
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="問題（必須）"
        fullWidth
        multiline
        minRows={3}
        maxRows={12}
        value={content}
        placeholder="問題"
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
          disabled={isSaving || overTitle || overContent}
        >
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </Stack>
    </Box>
  );
}
