"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import ConcernDetailView from "../detail/ConcernDetailView";

import IssueRow from "./IssueRow";

import type { Issue } from "@/types/issue";

type Props = {
  issues: Issue[];
  onIssueListChanged?: () => void | Promise<void>;
};

const IssueIndex = ({ issues, onIssueListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div>
      <h2>問題一覧</h2>

      {issues.length === 0 ? (
        <p>まだ問題はありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {issues.map((issue) => (
            <li key={issue.concernId} style={{ listStyle: "none" }}>
              <IssueRow
                issue={issue}
                onIssueListChanged={onIssueListChanged}
                onOpenDetail={() => setSelectedId(issue.concernId)}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>
          {selectedId !== null && (
            <ConcernDetailView onIssueListChanged={onIssueListChanged} concernId={selectedId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueIndex;
