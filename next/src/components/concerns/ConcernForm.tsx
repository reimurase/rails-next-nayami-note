"use client";

import { useState } from "react";

import { concernApi } from "@/lib/concernApi";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
} from "@/lib/concernValidation";

type ConcernFormProps = {
  onCreated: () => void;
};

const ConcernForm = ({ onCreated }: ConcernFormProps) => {
  const [triggerEvent, setTriggerEvent] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError(null);

    const nextErrors = validateOnSubmit({ trigger_event: triggerEvent, content });
    if (hasErrors(nextErrors)) return;

    setStatus("送信中...");
    setIsSubmitting(true);

    try {
      await concernApi.create({ triggerEvent, content });

      setStatus("登録成功！");
      setTriggerEvent("");
      setContent("");
      setSubmitted(false);
      onCreated();
    } catch (error) {
      console.error(error);
      setApiError("通信に失敗しました。時間を置いて再度お試しください。");
      setStatus("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = { trigger_event: triggerEvent, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const overTrigger = Boolean(lengthErrors.trigger_event);
  const overContent = Boolean(lengthErrors.content);

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
        onChange={(e) => setTriggerEvent(e.target.value)}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {(requiredErrors.trigger_event || lengthErrors.trigger_event) && (
        <p style={{ color: "tomato", fontSize: 12 }}>
          {/* 基本 requiredErrors.trigger_event は出ません。必須になれば拡張可能 */}
          {requiredErrors.trigger_event ?? lengthErrors.trigger_event}
        </p>
      )}
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {triggerEvent.length}/{CONCERN_LIMITS.trigger_event}
      </p>
      <textarea
        placeholder="とりあえず、今のなやみを書いてみよう（必須）"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {(requiredErrors.content || lengthErrors.content) && (
        <p style={{ color: "tomato", fontSize: 12 }}>
          {requiredErrors.content ?? lengthErrors.content}
        </p>
      )}
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

      {status && <p>{status}</p>}
    </form>
  );
};

export default ConcernForm;
