"use client";

import { useState } from "react";

import { issueApi } from "@/lib/api/issue";

type IssueFormProps = {
  concernId: number;
  onCreated: () => void;
};

const IssueForm = ({ concernId, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await issueApi.create(concernId, { title, content });

      setTitle("");
      setContent("");
      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="タイトル（任意）"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      <textarea
        placeholder="問題（任意）"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        rows={4}
        style={{
          width: "600px",
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
    </form>
  );
};

export default IssueForm;
