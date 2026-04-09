"use client";

import { useState } from "react";

import { normalizeApiError } from "@/lib/api/error";
import type { Issue } from "@/types/issue";
import { issueApi } from "@/lib/api/issue";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type IssueErrors,
  mapIssueValidationErrors,
} from "@/lib/issueValidation";

type Props = {
  concernId: number;
  issue: Issue;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function IssueEditor({ concernId, issue, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(issue.title || "");
  const [content, setContent] = useState(issue.content || "");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<IssueErrors>({});

  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { title, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const titleError = serverErrors.title ?? requiredErrors.title ?? lengthErrors.title;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.title);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await issueApi.update(concernId, { title, content });

      setSubmitted(false);

      await onSaved?.();
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
        value={title}
        placeholder="タイトル（任意）"
        onChange={(e) => {
          setTitle(e.target.value);
          setServerErrors((prev) => ({ ...prev, title: undefined }));
        }}
        disabled={isSaving}
      />

      {titleError && <p style={{ color: "tomato", fontSize: 12 }}>{titleError}</p>}

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {title.length}/{CONCERN_LIMITS.title}
      </p>

      <textarea
        value={content}
        placeholder="問題（必須）"
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

      <button onClick={handleSave} disabled={isSaving || overTrigger || overContent}>
        {isSaving ? "保存中..." : "保存"}
      </button>

      <button onClick={onCancel} disabled={isSaving}>
        キャンセル
      </button>
    </div>
  );
}
