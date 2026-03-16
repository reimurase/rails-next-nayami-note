"use client";

import { useState } from "react";

import ConcernDeleteButton from "./ConcernDeleteButton";

import { normalizeApiError } from "@/lib/api/error";
import type { Concern } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";
import {
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  CONCERN_LIMITS,
  type ConcernErrors,
  mapConcernValidationErrors,
} from "@/lib/concernValidation";

type Props = {
  concern: Concern;
  onChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
  onOpenDetail?: () => void;
};

const ConcernRow = ({ concern, onChanged, onOpenDetail }: Props) => {
  const [triggerEvent, setTriggerEvent] = useState(concern.triggerEvent);
  const [content, setContent] = useState(concern.content); // 入力中の値

  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<ConcernErrors>({});

  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ
  const [submitted, setSubmitted] = useState(false);

  const values = { triggerEvent, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const triggerEventError =
    serverErrors.triggerEvent ?? requiredErrors.triggerEvent ?? lengthErrors.triggerEvent;

  const contentError = serverErrors.content ?? requiredErrors.content ?? lengthErrors.content;

  const overTrigger = Boolean(lengthErrors.triggerEvent);
  const overContent = Boolean(lengthErrors.content);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors = validateOnSubmit(values);
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await concernApi.update(concern.id, { triggerEvent, content });

      setIsEditing(false);
      setSubmitted(false);

      // 一覧の再取得
      if (onChanged) onChanged();
    } catch (error: unknown) {
      const appError = normalizeApiError(error);

      if (appError.type === "validation") {
        setServerErrors(mapConcernValidationErrors(appError.errors));
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

  const handleCancel = () => {
    setIsEditing(false);
    setTriggerEvent(concern.triggerEvent);
    setContent(concern.content); // 元の内容に戻す
    setSubmitted(false);
    setApiError(null);
    setServerErrors({});
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isEditing ? (
        <>
          {apiError && (
            <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
              {apiError}
            </p>
          )}

          <textarea
            value={triggerEvent}
            placeholder="何があって、どう思ったんだろう。（任意）"
            onChange={(e) => {
              setTriggerEvent(e.target.value);
              setServerErrors((prev) => ({ ...prev, triggerEvent: undefined }));
            }}
            disabled={isSaving}
          />

          {triggerEventError && (
            <p style={{ color: "tomato", fontSize: 12 }}>{triggerEventError}</p>
          )}

          <p style={{ fontSize: 12, opacity: 0.8 }}>
            {triggerEvent.length}/{CONCERN_LIMITS.triggerEvent}
          </p>

          <textarea
            value={content}
            placeholder="とりあえず、今のなやみを書いてみよう（必須）"
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

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || overTrigger || overContent}
          >
            {isSaving ? "保存中..." : "保存"}
          </button>

          <button type="button" onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
          <div onClick={onOpenDetail}>
            <span>{concern.triggerEvent}</span>
            <span>{concern.content}</span>
          </div>

          <button
            onClick={() => {
              setIsEditing(true);
              setSubmitted(false);
              setApiError(null);
              setServerErrors({});
            }}
          >
            編集
          </button>
        </div>
      )}

      {/* 既存の削除ボタンはそのまま使える */}
      <ConcernDeleteButton
        id={concern.id}
        onDeleted={onChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default ConcernRow;
