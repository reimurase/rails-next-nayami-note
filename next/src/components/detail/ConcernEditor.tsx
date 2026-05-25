"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
import type { Concern } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";
import {
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  CONCERN_LIMITS,
  type ConcernErrors,
  mapConcernValidationErrors,
} from "@/lib/validations/concernValidation";

type Props = {
  concern: Concern;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConcernEditor({ concern, onSaved, onCancel }: Props) {
  const [triggerEvent, setTriggerEvent] = useState(concern.triggerEvent || "");
  const [content, setContent] = useState(concern.content || "");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<ConcernErrors>({});

  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { triggerEvent, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const triggerEventError =
    serverErrors.triggerEvent ?? requiredErrors.triggerEvent ?? lengthErrors.triggerEvent;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.triggerEvent);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await concernApi.update(concern.id, values);

      setSubmitted(false);

      await onSaved?.();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapConcernValidationErrors(appError.errors));
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
        label="きっかけ（任意）"
        fullWidth
        multiline
        minRows={3}
        maxRows={5}
        value={triggerEvent}
        placeholder="何があって、どう思ったんだろう"
        onChange={(e) => {
          setTriggerEvent(e.target.value);
          setServerErrors((prev) => ({ ...prev, triggerEvent: undefined }));
        }}
        disabled={isSaving}
        error={Boolean(triggerEventError)}
        helperText={triggerEventError || `${triggerEvent.length}/${CONCERN_LIMITS.triggerEvent}`}
        slotProps={{
          formHelperText: {
            sx: triggerEventError ? undefined : { textAlign: "right" },
          },
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="なやみ（必須）"
        fullWidth
        multiline
        minRows={3}
        maxRows={12}
        value={content}
        placeholder="とりあえず、今のなやみを書いてみよう"
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
          disabled={isSaving || overTrigger || overContent}
        >
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </Stack>
    </Box>
  );
}
