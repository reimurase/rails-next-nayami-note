"use client";

import useSWR from "swr";

import RoadmapIndex from "@/components/roadmaps/RoadmapIndex";
import { roadmapApi } from "@/lib/roadmapApi";

export default function RoadmapPageClient() {
  const {
    data: roadmaps,
    error,
    isLoading,
  } = useSWR("/api/v1/roadmaps", () => roadmapApi.getRoadmaps());

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return <RoadmapIndex roadmaps={roadmaps ?? []} />;
}
