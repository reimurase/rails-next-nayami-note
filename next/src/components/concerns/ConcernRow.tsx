"use client";

import { useState } from "react";
import axios from "axios";

import type { Concern } from "./ConcernIndex";
import ConcernDeleteButton from "./ConcernDeleteButton";

type Props = {
  concern: Concern;
  onChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
};

const ConcernRow = ({ concern, onChanged }: Props) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
  const [value, setValue] = useState(concern.content); // 入力中の値
  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.patch(`http://localhost:3000/api/v1/concerns/${concern.id}`, {
        concern: { content: value },
      });

      setIsEditing(false);
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
    setValue(concern.content); // 元の内容に戻す
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isEditing ? (
        <>
          <input value={value} onChange={(e) => setValue(e.target.value)} disabled={isSaving} />
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </button>
          <button onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </>
      ) : (
        <>
          <span>{concern.content}</span>
          <button onClick={() => setIsEditing(true)}>編集</button>
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
