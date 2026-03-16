"use client";

import { useState } from "react";

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
} from "@/lib/concernValidation";

type Props = {
  concernId: number;
  concern: Concern;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConcernEditor({ concernId, concern, onSaved, onCancel }: Props) {
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
      await concernApi.update(concernId, values);

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
    <div>
      {apiError && (
        <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
          {apiError}
        </p>
      )}

      <textarea
        value={triggerEvent}
        placeholder="何があって、どう思ったんだろう。（任意）"
        onChange={(e) => {
          setTriggerEvent(e.target.value);
          setServerErrors((prev) => ({ ...prev, triggerEvent: undefined }));
        }}
        disabled={isSaving}
      />

      {triggerEventError && <p style={{ color: "tomato", fontSize: 12 }}>{triggerEventError}</p>}

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {triggerEvent.length}/{CONCERN_LIMITS.triggerEvent}
      </p>

      <textarea
        value={content}
        placeholder="とりあえず、今のなやみを書いてみよう（必須）"
        onChange={(e) => {
          setContent(e.target.value);
          setServerErrors((prev) => ({ ...prev, content: undefined }));
        }}
        disabled={isSaving}
      />

      {contentError && <p style={{ color: "tomato", fontSize: 12 }}>{contentError}</p>}

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {content.length}/{CONCERN_LIMITS.content}
      </p>

      <button type="button" onClick={handleSave} disabled={isSaving || overTrigger || overContent}>
        {isSaving ? "保存中..." : "保存"}
      </button>

      <button type="button" onClick={onCancel} disabled={isSaving}>
        キャンセル
      </button>
    </div>
  );
}
