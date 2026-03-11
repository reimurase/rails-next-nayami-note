"use client";

import { useState } from "react";

import IssueCreateSheet from "../issues/IssueCreateSheet";
import IssueDeleteButton from "../issues/IssueDeleteButton";

import type { Issue } from "@/types/issue";
import { issueApi } from "@/lib/api/issue";

type Props = {
  concernId: number;
  issue: Issue | null;
  onIssueChanged?: () => void | Promise<void>;
};

export default function IssueSection({ concernId, issue, onIssueChanged }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const startEditing = () => {
    if (!issue) return;

    setTitle(issue.title || "");
    setContent(issue.content || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await issueApi.update(concernId, { title, content });
      setIsEditing(false);

      // issueページ / 詳細のissueを更新
      if (onIssueChanged) await onIssueChanged();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(issue?.title || "");
    setContent(issue?.content || "");
    setIsEditing(false);
  };

  const handleCreated = async () => {
    setIsSheetOpen(false);

    // issueページ / 詳細のissueを更新
    if (onIssueChanged) await onIssueChanged();
  };

  return (
    <div>
      <h3>Issue</h3>

      {!issue ? (
        <div>
          <p>issue はありません</p>
          <button onClick={() => setIsSheetOpen(true)}>新規作成</button>

          <IssueCreateSheet
            concernId={concernId}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onCreated={handleCreated}
          />
        </div>
      ) : isEditing ? (
        <div>
          <textarea
            value={title}
            placeholder="タイトル（任意）"
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />

          <textarea
            value={content}
            placeholder="問題（必須）"
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
          />

          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </button>

          <button onClick={handleCancel} disabled={isSaving}>
            キャンセル
          </button>
        </div>
      ) : (
        <div>
          <ul>
            <li>タイトル: {issue.title || "なし"}</li>
            <li>内容: {issue.content || "なし"}</li>
          </ul>

          <button onClick={startEditing}>編集</button>
          <IssueDeleteButton
            concernId={concernId}
            onDeleted={onIssueChanged} // 削除成功時も一覧更新
          />
        </div>
      )}
    </div>
  );
}
