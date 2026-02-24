"use client";

import useSWR from "swr";

import type { Issue } from "@/lib/issueApi";
import { IssueApi } from "@/lib/issueApi";

type Props = {
  id: number;
};

export default function IssueDetail({ id }: Props) {
  const {
    data: issue,
    error,
    isLoading,
  } = useSWR<Issue>(`/api/v1/issues/${id}`, () => IssueApi.getIssue({ id }));

  if (isLoading) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>詳細ページ</h2>
      <ul>
        <li>タイトル: {issue.title}</li>
        <li>内容: {issue?.content}</li>
      </ul>
    </div>
  );
}
