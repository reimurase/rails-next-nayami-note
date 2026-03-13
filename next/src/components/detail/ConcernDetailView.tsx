"use client";

import useSWR from "swr";

import IssueSection from "./IssueSection";
import RoadmapSection from "./RoadmapSection";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  concernId: number;
  onIssueListChanged?: () => void | Promise<void>;
  onRoadmapListChanged?: () => void | Promise<void>;
};

export default function ConcernDetailView({
  concernId,
  onIssueListChanged,
  onRoadmapListChanged,
}: Props) {
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

  const refreshRoadmapDetail = async () => {
    await mutate();
  };

  const handleIssueChanged = async () => {
    await refreshIssueDetail();
    await onIssueListChanged?.();
  };

  const handleRoadmapChanged = async () => {
    await refreshRoadmapDetail();
    await onRoadmapListChanged?.();
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

      <RoadmapSection
        concernId={detail.concern.id}
        roadmap={detail.roadmap}
        onRoadmapChanged={handleRoadmapChanged}
      />
    </div>
  );
}
