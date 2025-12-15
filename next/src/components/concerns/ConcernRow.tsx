"use client";

import { useState } from "react";
import axios from "axios";

import type { Concern } from "./ConcernIndex";
import ConcernDeleteButton from "./ConcernDeleteButton";

import { validateConcern, isValidConcern } from "@/lib/concernValidation";

type Props = {
  concern: Concern;
  onChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
};

const ConcernRow = ({ concern, onChanged }: Props) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
  const [triggerEvent, setTriggerEvent] = useState(concern.trigger_event);
  const [content, setContent] = useState(concern.content); // 入力中の値
  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);

    const nextErrors = validateConcern({ trigger_event: triggerEvent, content });
    if (!isValidConcern(nextErrors)) return;

    try {
      setIsSaving(true);
      await axios.patch(`http://localhost:3000/api/v1/concerns/${concern.id}`, {
        concern: { trigger_event: triggerEvent, content: content },
      });

      setIsEditing(false);
      setSubmitted(false);

      // 一覧の再取得
      if (onChanged) onChanged();
    } catch (e) {
      console.error(e);
      alert("更新に失敗しました");
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

  const currentErrors = validateConcern({ trigger_event: triggerEvent, content });
  const overTrigger = triggerEvent.trim().length > 120;
  const overContent = content.trim().length > 1000;

  const showRequiredTrigger = !triggerEvent.trim() && submitted;
  const showRequiredContent = !content.trim() && submitted;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isEditing ? (
        <>
          <input
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value)}
            disabled={isSaving}
          />
          {(showRequiredTrigger || overTrigger) && (
            <p style={{ color: "tomato", fontSize: 12 }}>{currentErrors.trigger_event}</p>
          )}
          <input value={content} onChange={(e) => setContent(e.target.value)} disabled={isSaving} />
          {(showRequiredContent || overContent) && (
            <p style={{ color: "tomato", fontSize: 12 }}>{currentErrors.content}</p>
          )}
          <button onClick={handleSave} disabled={isSaving || overTrigger || overContent}>
            {isSaving ? "保存中..." : "保存"}
          </button>
          <button onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </>
      ) : (
        <>
          <span>{concern.trigger_event}</span>
          <span>{concern.content}</span>
          <button
            onClick={() => {
              setIsEditing(true);
              setSubmitted(false);
            }}
          >
            編集
          </button>
        </>
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
