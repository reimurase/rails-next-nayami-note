"use client";

import { useState } from "react";

import { normalizeApiError } from "@/lib/api/error";
import { issueApi } from "@/lib/api/issue";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type IssueErrors,
  mapIssueValidationErrors,
} from "@/lib/validations/issueValidation";

type IssueFormProps = {
  concernId: number;
  onCreated: () => void;
};

const IssueForm = ({ concernId, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<IssueErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { title, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const titleError = serverErrors.title ?? requiredErrors.title ?? lengthErrors.title;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.title);
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
      await issueApi.create(concernId, values);

      setTitle("");
      setContent("");
      setSubmitted(false);
      onCreated();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapIssueValidationErrors(appError.errors));
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
        placeholder="タイトル（任意）"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setServerErrors((prev) => ({ ...prev, title: undefined }));
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />

      {titleError && <p style={{ color: "tomato", fontSize: 12 }}>{titleError}</p>}
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {title.length}/{CONCERN_LIMITS.title}
      </p>

      <textarea
        placeholder="問題（必須）"
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

export default IssueForm;
