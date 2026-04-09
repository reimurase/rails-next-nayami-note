"use client";

import { useState } from "react";

import { normalizeApiError } from "@/lib/api/error";
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

type RoadmapFormProps = {
  concernId: number;
  onCreated: () => void;
};

const RoadmapForm = ({ concernId, onCreated }: RoadmapFormProps) => {
  const [goal, setGoal] = useState("");
  const [content, setContent] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<RoadmapErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const values = { goal, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const goalError = serverErrors.goal ?? requiredErrors.goal ?? lengthErrors.goal;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.goal);
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
      await roadmapApi.create(concernId, values);

      setGoal("");
      setContent("");
      setSubmitted(false);
      onCreated();
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
        placeholder="ゴール（任意）"
        value={goal}
        onChange={(e) => {
          setGoal(e.target.value);
          setServerErrors((prev) => ({ ...prev, goal: undefined }));
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />

      {goalError && <p style={{ color: "tomato", fontSize: 12 }}>{goalError}</p>}
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        {goal.length}/{CONCERN_LIMITS.goal}
      </p>

      <textarea
        placeholder="ロードマップ（必須）"
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

export default RoadmapForm;
