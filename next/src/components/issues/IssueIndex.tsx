"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import IssueRow from "./IssueRow";
import IssueDetail from "./IssueDetail";

import type { Issue } from "@/lib/issueApi";

type Props = {
  issues: Issue[];
  onChanged?: () => void;
};

const IssueIndex = ({ issues, onChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div>
      <h2>問題一覧</h2>

      {issues.length === 0 ? (
        <p>まだ問題はありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {issues.map((issue) => (
            <li key={issue.id} style={{ listStyle: "none" }}>
              <IssueRow
                issue={issue}
                onChanged={onChanged}
                onOpenDetail={() => setSelectedId(issue.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>{selectedId !== null && <IssueDetail id={selectedId} />}</DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueIndex;
