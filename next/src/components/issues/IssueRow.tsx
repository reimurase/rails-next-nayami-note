"use client";

import IssueDeleteButton from "./IssueDeleteButton";

import type { Issue } from "@/types/issue";

type Props = {
  issue: Issue;
  onChanged?: () => void;
  onOpenDetail?: () => void;
};

const IssueRow = ({ issue, onChanged, onOpenDetail }: Props) => {
  return (
    <div onClick={onOpenDetail} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>{issue.title}</span>
      <span>{issue.content}</span>

      {/* 既存の削除ボタンはそのまま使える */}
      <IssueDeleteButton
        id={issue.id}
        onDeleted={onChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default IssueRow;
