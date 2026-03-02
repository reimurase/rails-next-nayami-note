"use client";

import { useState } from "react";

import ConcernDeleteButton from "./ConcernDeleteButton";

import type { Concern } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";
import {
  hasErrors,
  validateLength,
  validateOnSubmit,
  validateRequired,
  CONCERN_LIMITS,
} from "@/lib/concernValidation";

type Props = {
  concern: Concern;
  onChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
  onOpenDetail?: () => void;
};

const ConcernRow = ({ concern, onChanged, onOpenDetail }: Props) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
  const [triggerEvent, setTriggerEvent] = useState(concern.trigger_event);
  const [content, setContent] = useState(concern.content); // 入力中の値
  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSave = async () => {
    setSubmitted(true);
    setApiError(null);

    const nextErrors = validateOnSubmit({ trigger_event: triggerEvent, content });
    if (hasErrors(nextErrors)) return;

    try {
      setIsSaving(true);
      await concernApi.update(concern.id, { triggerEvent, content });

      setIsEditing(false);
      setSubmitted(false);

      // 一覧の再取得
      if (onChanged) onChanged();
    } catch (e) {
      console.error(e);
      setApiError("更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTriggerEvent(concern.trigger_event);
    setContent(concern.content); // 元の内容に戻す
    setSubmitted(false);
  };

  const values = { trigger_event: triggerEvent, content };

  const lengthErrors = validateLength(values);
  const requiredErrors = submitted ? validateRequired(values) : {};

  const overTrigger = Boolean(lengthErrors.trigger_event);
  const overContent = Boolean(lengthErrors.content);

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
            onChange={(e) => setTriggerEvent(e.target.value)}
            disabled={isSaving}
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

          <textarea
            value={content}
            placeholder="とりあえず、今のなやみを書いてみよう（必須）"
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
          />

          {(requiredErrors.content || lengthErrors.content) && (
            <p style={{ color: "tomato", fontSize: 12 }}>
              {requiredErrors.content ?? lengthErrors.content}
            </p>
          )}

          <p style={{ fontSize: 12, opacity: 0.8 }}>
            {content.length}/{CONCERN_LIMITS.content}
          </p>

          <button onClick={handleSave} disabled={isSaving || overTrigger || overContent}>
            {isSaving ? "保存中..." : "保存"}
          </button>

          <button onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </>
      ) : (
        <div
          onClick={onOpenDetail}
          style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}
        >
          <span>{concern.trigger_event}</span>
          <span>{concern.content}</span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // 詳細を開かない
              setIsEditing(true);
              setSubmitted(false);
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
