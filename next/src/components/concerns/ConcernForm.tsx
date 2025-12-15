"use client";

import { useState } from "react";
import axios from "axios";

import { validateConcern, isValidConcern } from "@/lib/concernValidation";

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

    const nextErrors = validateConcern({ trigger_event: triggerEvent, content });
    if (!isValidConcern(nextErrors)) return;

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

  const currentErrors = validateConcern({ trigger_event: triggerEvent, content });
  const showRequiredTrigger = !triggerEvent.trim() && submitted;
  const showRequiredContent = !content.trim() && submitted;
  const overTrigger = triggerEvent.trim().length > 120;
  const overContent = content.trim().length > 1000;
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
      {(showRequiredTrigger || overTrigger) && (
        <p style={{ color: "tomato", fontSize: 12 }}>{currentErrors.trigger_event}</p>
      )}
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
      {(showRequiredContent || overContent) && (
        <p style={{ color: "tomato", fontSize: 12 }}>{currentErrors.content}</p>
      )}
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
