"use client";

import useSWR from "swr";

import { roadmapApi } from "@/lib/roadmapApi";

export default function RoadmapPageClient() {
  const {
    data: roadmaps,
    error,
    isLoading,
  } = useSWR("/api/v1/roadmaps", () => roadmapApi.getRoadmaps());

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div>
        <h2>ロードマップ一覧</h2>
        <p>まだロードマップはありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>ロードマップ一覧</h2>
      <p>{JSON.stringify(roadmaps[0])}</p>
    </div>
  );
}
