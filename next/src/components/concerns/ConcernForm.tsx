"use client";

import { useState } from "react";
import axios from "axios";

import { validateConcern } from "@/lib/concernValidation";

type ConcernFormProps = {
  onCreated: () => void;
};

export default function ConcernForm({ onCreated }: ConcernFormProps) {
  const [triggerEvent, setTriggerEvent] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<{ trigger_event: boolean; content: boolean }>({
    trigger_event: false,
    content: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setStatus("送信中...");
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:3000/api/v1/concerns", {
        concern: { trigger_event: triggerEvent, content },
      });

      setStatus("登録成功！");
      setTriggerEvent("");
      setContent("");
      onCreated();
    } catch (error) {
      console.error(error);
      setStatus("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentErrors = validateConcern({ trigger_event: triggerEvent, content });
  const showRequiredTrigger = !triggerEvent.trim() && (submitted || touched.trigger_event);
  const showRequiredContent = !content.trim() && (submitted || touched.content);
  const overTrigger = triggerEvent.trim().length > 120;
  const overContent = content.trim().length > 1000;
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="きっかけを入力"
        value={triggerEvent}
        onChange={(e) => setTriggerEvent(e.target.value)}
        onBlur={() => setTouched((p) => ({ ...p, trigger_event: true }))}
        style={{
          width: "300px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {(showRequiredTrigger || overTrigger) && (
        <p
          style={{
            color: overTrigger || submitted ? "tomato" : "#888",
            fontSize: 12,
          }}
        >
          {currentErrors.trigger_event}
        </p>
      )}
      <input
        type="text"
        placeholder="なやみを入力"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => setTouched((p) => ({ ...p, content: true }))}
        style={{
          width: "300px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      {(showRequiredContent || overContent) && (
        <p
          style={{
            color: overContent || submitted ? "tomato" : "#888",
            fontSize: 12,
          }}
        >
          {currentErrors.content}
        </p>
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
