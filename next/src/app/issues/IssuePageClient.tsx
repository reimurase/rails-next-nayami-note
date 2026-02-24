"use client";

import useSWR from "swr";

import type { Issue } from "@/lib/issueApi";
import { IssueApi } from "@/lib/issueApi";

export default function IssuePageClient() {
  const {
    data: issues,
    error,
    isLoading,
  } = useSWR<Issue[]>("/api/v1/issues", () => IssueApi.getIssues());

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  if (!issues || issues.length === 0) {
    return (
      <div>
        <h2>問題一覧</h2>
        <p>まだ問題はありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>問題一覧</h2>
      <p>{JSON.stringify(issues[0])}</p>
    </div>
  );
}
