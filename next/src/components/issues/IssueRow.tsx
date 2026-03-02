"use client";

import { useState } from "react";

import IssueDeleteButton from "./IssueDeleteButton";

import { issueApi } from "@/lib/api/issue";
import type { Issue } from "@/types/issue";

type Props = {
  issue: Issue;
  onChanged?: () => void;
  onOpenDetail?: () => void;
};

const IssueRow = ({ issue, onChanged, onOpenDetail }: Props) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか

  const [title, setTitle] = useState(issue.title);
  const [content, setContent] = useState(issue.content); // 入力中の値

  const [isSaving, setIsSaving] = useState(false); // 保存中フラグ

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await issueApi.update(issue.id, { title, content });

      setIsEditing(false);

      // 一覧の再取得
      if (onChanged) onChanged();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(issue.title);
    setContent(issue.content); // 元の内容に戻す
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isEditing ? (
        <>
          <textarea
            value={title}
            placeholder="何があって、どう思ったんだろう。（任意）"
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />

          <textarea
            value={content}
            placeholder="とりあえず、今のなやみを書いてみよう（必須）"
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
          <span>{issue.title}</span>
          <span>{issue.content}</span>

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
      <IssueDeleteButton
        id={issue.id}
        onDeleted={onChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default IssueRow;
