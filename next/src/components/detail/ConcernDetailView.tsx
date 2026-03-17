"use client";

import useSWR from "swr";

import ConcernSection from "./ConcernSection";
import IssueSection from "./IssueSection";
import RoadmapSection from "./RoadmapSection";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  concernId: number;
  onConcernListChanged?: () => void | Promise<void>;
  onIssueListChanged?: () => void | Promise<void>;
  onRoadmapListChanged?: () => void | Promise<void>;
  onConcernDeleted?: () => void | Promise<void>;
};

export default function ConcernDetailView({
  concernId,
  onConcernListChanged,
  onIssueListChanged,
  onRoadmapListChanged,
  onConcernDeleted,
}: Props) {
  const {
    data: detail,
    error,
    isLoading,
    mutate,
  } = useSWR<ConcernDetail>(`/api/v1/concerns/${concernId}`, () =>
    concernApi.getConcern(concernId)
  );

  const refreshDetail = async () => {
    await mutate();
  };

  const handleConcernChanged = async () => {
    await refreshDetail();
    await onConcernListChanged?.();
  };

  const handleConcernDeleted = async () => {
    await onConcernDeleted?.();
  };

  const handleIssueChanged = async () => {
    await refreshDetail();
    await onIssueListChanged?.();
  };

  const handleRoadmapChanged = async () => {
    await refreshDetail();
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

      <ConcernSection
        concern={detail.concern}
        onConcernUpdated={handleConcernChanged}
        onConcernDeleted={handleConcernDeleted}
      />

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
