"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { normalizeApiError } from "@/lib/api/error";
import { concernApi } from "@/lib/api/concern";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type ConcernErrors,
  mapConcernValidationErrors,
} from "@/lib/validations/concernValidation";

type ConcernFormProps = {
  onCreated?: () => void;
};

const ConcernForm = ({ onCreated }: ConcernFormProps) => {
  const [triggerEvent, setTriggerEvent] = useState("");
  const [content, setContent] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<ConcernErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { triggerEvent, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const triggerEventError =
    serverErrors.triggerEvent ?? requiredErrors.triggerEvent ?? lengthErrors.triggerEvent;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.triggerEvent);
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
      await concernApi.create(values);

      setTriggerEvent("");
      setContent("");
      setSubmitted(false);
      onCreated?.();
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
          label="きっかけ（任意）"
          placeholder="何があって、どう思ったんだろう"
          value={triggerEvent}
          onChange={(e) => {
            setTriggerEvent(e.target.value);
            setServerErrors((prev) => ({ ...prev, triggerEvent: undefined }));
          }}
          multiline
          minRows={3}
          maxRows={5}
          fullWidth
          error={Boolean(triggerEventError)}
          helperText={
            triggerEventError ?? `${triggerEvent.length} / ${CONCERN_LIMITS.triggerEvent}`
          }
        />

        <TextField
          label="なやみ（必須）"
          placeholder="とりあえず、今のなやみを書いてみよう"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setServerErrors((prev) => ({ ...prev, content: undefined }));
          }}
          multiline
          minRows={8}
          maxRows={17}
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

export default ConcernForm;
