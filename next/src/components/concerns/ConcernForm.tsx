"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      {apiError && (
        <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
          {apiError}
        </p>
      )}

      <textarea
        placeholder="何があって、どう思ったんだろう。（任意）"
        value={triggerEvent}
        onChange={(e) => {
          setTriggerEvent(e.target.value);
          setServerErrors((prev) => ({ ...prev, triggerEvent: undefined }));
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {triggerEventError && <p style={{ color: "tomato", fontSize: 12 }}>{triggerEventError}</p>}
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {triggerEvent.length}/{CONCERN_LIMITS.triggerEvent}
      </p>

      <textarea
        placeholder="とりあえず、今のなやみを書いてみよう（必須）"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setServerErrors((prev) => ({ ...prev, content: undefined }));
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {contentError && <p style={{ color: "tomato", fontSize: 12 }}>{contentError}</p>}
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {content.length}/{CONCERN_LIMITS.content}
      </p>

      <button
        type="submit"
        disabled={isSubmitting || overTrigger || overContent}
        style={{
          marginLeft: "8px",
          padding: "8px 16px",
          fontSize: "16px",
        }}
      >
        {isSubmitting ? "追加中..." : "追加"}
      </button>
    </form>
  );
};

export default ConcernForm;
