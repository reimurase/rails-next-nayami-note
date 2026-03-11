"use client";

import useSWR from "swr";

import IssueSection from "./IssueSection";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  concernId: number;
  onIssueListChanged?: () => void | Promise<void>;
};

export default function ConcernDetailView({ concernId, onIssueListChanged }: Props) {
  const {
    data: detail,
    error,
    isLoading,
    mutate,
  } = useSWR<ConcernDetail>(`/api/v1/concerns/${concernId}`, () =>
    concernApi.getConcern(concernId)
  );

  const refreshIssueDetail = async () => {
    await mutate();
  };

  const handleIssueChanged = async () => {
    await refreshIssueDetail();
    await onIssueListChanged?.();
  };

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

  if (!detail) {
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

      <h3>Concern</h3>
      <ul>
        <li>きっかけ: {detail.concern.triggerEvent || "なし"}</li>
        <li>内容: {detail.concern.content}</li>
      </ul>

      <IssueSection
        concernId={detail.concern.id}
        issue={detail.issue}
        onIssueChanged={handleIssueChanged}
      />

      <h3>Roadmap</h3>
      {detail.roadmap ? (
        <ul>
          <li>ゴール: {detail.roadmap.goal || "なし"}</li>
          <li>内容: {detail.roadmap.content || "なし"}</li>
        </ul>
      ) : (
        <p>roadmap はありません</p>
      )}
    </div>
  );
}
