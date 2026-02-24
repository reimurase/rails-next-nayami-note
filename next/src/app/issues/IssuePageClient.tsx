"use client";

import useSWR from "swr";

import IssueIndex from "@/components/issues/IssueIndex";
import type { Issue } from "@/lib/issueApi";
import { issueApi } from "@/lib/issueApi";

export default function IssuePageClient() {
  const {
    data: issues,
    error,
    isLoading,
  } = useSWR<Issue[]>("/api/v1/issues", () => issueApi.getIssues());

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return <IssueIndex issues={issues ?? []} />;
}
