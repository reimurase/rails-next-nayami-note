"use client";

import { useState } from "react";
import axios from "axios";

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

export default function ConcernForm({ onCreated }: ConcernFormProps) {
  const [triggerEvent, setTriggerEvent] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setStatus("送信中...");
    setIsSubmitting(true);

    const nextErrors = validateOnSubmit({ trigger_event: triggerEvent, content });
    if (hasErrors(nextErrors)) return;

    try {
      await axios.post("http://localhost:3000/api/v1/concerns", {
        concern: { trigger_event: triggerEvent, content },
      });

      setStatus("登録成功！");
      setTriggerEvent("");
      setContent("");
      setSubmitted(false);
      onCreated();
    } catch (error) {
      console.error(error);
      setStatus("エラーが発生しました");
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
      <input
        type="text"
        placeholder="なやみのきっかけになった出来事は何だっただろう？（任意）"
        value={triggerEvent}
        onChange={(e) => setTriggerEvent(e.target.value)}
        style={{
          width: "300px",
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
      <input
        type="text"
        placeholder="とりあえず、今のなやみを書いてみよう（必須）"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "300px",
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
        {content.length >= CONCERN_LIMITS.contentWarn &&
          content.length <= CONCERN_LIMITS.content && (
            <span style={{ marginLeft: 8 }}>けっこう進んだなあ…。この感じでいけるかな。</span>
          )}
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
}
