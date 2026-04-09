"use client";

import { useState } from "react";

import { normalizeApiError } from "@/lib/api/error";
import type { Roadmap } from "@/types/roadmap";
import { roadmapApi } from "@/lib/api/roadmap";
import {
  CONCERN_LIMITS,
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  type RoadmapErrors,
  mapRoadmapValidationErrors,
} from "@/lib/validations/roadmapValidation";

type Props = {
  concernId: number;
  roadmap: Roadmap;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function RoadmapEditor({ concernId, roadmap, onSaved, onCancel }: Props) {
  const [goal, setGoal] = useState(roadmap.goal || "");
  const [content, setContent] = useState(roadmap.content || "");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<RoadmapErrors>({});

  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { goal, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const goalError = serverErrors.goal ?? requiredErrors.goal ?? lengthErrors.goal;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.goal);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await roadmapApi.update(concernId, { goal, content });

      setSubmitted(false);

      await onSaved?.();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapRoadmapValidationErrors(appError.errors));
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
        value={goal}
        placeholder="ゴール（任意）"
        onChange={(e) => {
          setGoal(e.target.value);
          setServerErrors((prev) => ({ ...prev, goal: undefined }));
        }}
        disabled={isSaving}
      />

      {goalError && <p style={{ color: "tomato", fontSize: 12 }}>{goalError}</p>}

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {goal.length}/{CONCERN_LIMITS.goal}
      </p>

      <textarea
        value={content}
        placeholder="ロードマップ（必須）"
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
