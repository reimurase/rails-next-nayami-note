"use client";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import IssueIndex from "@/components/issues/IssueIndex";
import ConcernCreateDialog from "@/components/concerns/ConcernCreateDialog";
import { issueApi } from "@/lib/api/issue";

export default function PageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: issues,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/issues/archived", () => issueApi.getArchivedIssues());

  const refreshIssueList = async () => {
    await mutate();
  };

  const handleCreated = async () => {
    await globalMutate("/api/v1/concerns");
    setIsDialogOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <IconButton color="primary" onClick={() => setIsDialogOpen(true)} aria-label="なやみを追加">
          <AddIcon />
        </IconButton>
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <IssueIndex issues={issues ?? []} onIssueListChanged={refreshIssueList} />
      </div>

      <ConcernCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
