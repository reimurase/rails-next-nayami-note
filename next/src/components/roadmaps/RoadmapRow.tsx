"use client";

import { useState } from "react";

import RoadmapDeleteButton from "./RoadmapDeleteButton";

import { roadmapApi } from "@/lib/api/roadmap";
import { Roadmap } from "@/types/roadmap";

type Props = {
  roadmap: Roadmap;
  onChanged?: () => void;
  onOpenDetail?: () => void;
};

const RoadmapRow = ({ roadmap, onChanged, onOpenDetail }: Props) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか

  const [goal, setGoal] = useState(roadmap.goal);
  const [content, setContent] = useState(roadmap.content); // 入力中の値

  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await roadmapApi.update(roadmap.id, { goal, content });

      setIsEditing(false);

      // 一覧の再取得
      if (onChanged) onChanged();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setGoal(roadmap.goal);
    setContent(roadmap.content); // 元の内容に戻す
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isEditing ? (
        <>
          <textarea
            value={goal}
            placeholder="ゴール（任意）"
            onChange={(e) => setGoal(e.target.value)}
            disabled={isSaving}
          />

          <textarea
            value={content}
            placeholder="ロードマップ（任意）"
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
          />

          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </button>

          <button onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </>
      ) : (
        <div onClick={onOpenDetail} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>{roadmap.goal}</span>
          <span>{roadmap.content}</span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // 詳細を開かない
              setIsEditing(true);
            }}
          >
            編集
          </button>
        </div>
      )}

      {/* 既存の削除ボタンはそのまま使える */}
      <RoadmapDeleteButton
        id={roadmap.id}
        onDeleted={onChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default RoadmapRow;
