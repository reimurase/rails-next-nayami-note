"use client";

import useSWR from "swr";

import IssueIndex from "@/components/issues/IssueIndex";
import { issueApi } from "@/lib/api/issue";

export default function IssuePageClient() {
  const {
    data: issues,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/issues", () => issueApi.getIssues());

  const refreshIssueList = async () => {
    await mutate();
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div>
      <IssueIndex issues={issues ?? []} onIssueListChanged={refreshIssueList} />
    </div>
  );
}
