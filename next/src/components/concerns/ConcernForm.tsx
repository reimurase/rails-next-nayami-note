"use client";

import { useState } from "react";
import axios from "axios";

type ConcernFormProps = {
  onCreated: () => void;
};

export default function ConcernForm({ onCreated }: ConcernFormProps) {
  const [triggerEvent, setTriggerEvent] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="きっかけを入力"
        value={triggerEvent}
        onChange={(e) => setTriggerEvent(e.target.value)}
        style={{
          width: "300px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      <input
        type="text"
        placeholder="なやみを入力"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "300px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
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
