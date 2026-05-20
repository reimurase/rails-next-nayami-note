"use client";

import { useState } from "react";
import useSWR from "swr";

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
    await refreshIssueList();
    setIsDialogOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div style={{ paddingBottom: isDialogOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <IssueIndex issues={issues ?? []} onIssueListChanged={refreshIssueList} />

      <ConcernCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
