"use client";

import IssueDeleteButton from "./IssueDeleteButton";
import IssueArchiveButton from "./IssueArchiveButton";

import type { Issue } from "@/types/issue";

type Props = {
  issue: Issue;
  onIssueListChanged?: () => void | Promise<void>;
  onOpenDetail?: () => void;
};

const IssueRow = ({ issue, onIssueListChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div onClick={onOpenDetail} style={{ cursor: "pointer" }}>
        <span>{issue.title}</span>
        <span>{issue.content}</span>
      </div>

      <IssueDeleteButton
        concernId={issue.concernId}
        onDeleted={onIssueListChanged} // 削除成功時も一覧更新
      />

      <IssueArchiveButton
        issueId={issue.id}
        archivedAt={issue.archivedAt}
        onArchiveChanged={onIssueListChanged}
      />
    </div>
  );
};

export default IssueRow;
