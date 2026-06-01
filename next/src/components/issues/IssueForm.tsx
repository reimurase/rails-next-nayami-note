"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
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

type IssueFormProps = {
  concernId: number;
  onCreated: () => void;
};

const IssueForm = ({ concernId, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<IssueErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { title, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const titleError = serverErrors.title ?? requiredErrors.title ?? lengthErrors.title;
  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.title);
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
      await issueApi.create(concernId, values);

      setTitle("");
      setContent("");
      setSubmitted(false);
      onCreated();
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
          label="タイトル（任意）"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setServerErrors((prev) => ({ ...prev, title: undefined }));
          }}
          multiline
          minRows={2}
          maxRows={4}
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError ?? `${title.length} / ${CONCERN_LIMITS.title}`}
        />

        <TextField
          label="問題（必須）"
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

export default IssueForm;
