"use client";

import IssueDeleteButton from "./IssueDeleteButton";

import type { Issue } from "@/types/issue";

type Props = {
  issue: Issue;
  onIssueListChanged?: () => void;
  onOpenDetail?: () => void;
};

const IssueRow = ({ issue, onIssueListChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div onClick={onOpenDetail} style={{ cursor: "pointer" }}>
        <span>{issue.title}</span>
        <span>{issue.content}</span>
      </div>

      {/* 既存の削除ボタンはそのまま使える */}
      <IssueDeleteButton
        concernId={issue.concernId}
        onDeleted={onIssueListChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default IssueRow;
