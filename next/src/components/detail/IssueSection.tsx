"use client";

import { useState } from "react";

import IssueCreateSheet from "../issues/IssueCreateSheet";
import IssueDeleteButton from "../issues/IssueDeleteButton";
import IssueArchiveButton from "../issues/IssueArchiveButton";

import IssueEditor from "./IssueEditor";

import type { Issue } from "@/types/issue";

type Props = {
  concernId: number;
  issue: Issue | null;
  onIssueChanged?: () => void | Promise<void>;
  onIssueArchived?: () => void | Promise<void>;
};

export default function IssueSection({ concernId, issue, onIssueChanged, onIssueArchived }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    if (!issue) return;
    setIsEditing(true);
  };

  const handleSaved = async () => {
    setIsEditing(false);

    // issueページ / 詳細のissueを更新
    await onIssueChanged?.();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCreated = async () => {
    setIsSheetOpen(false);

    // issueページ / 詳細のissueを更新
    await onIssueChanged?.();
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
        <IssueEditor
          concernId={concernId}
          issue={issue}
          onSaved={handleSaved}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          <IssueArchiveButton
            issueId={issue.id}
            archivedAt={issue.archivedAt}
            onArchiveChanged={onIssueArchived}
          />
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
