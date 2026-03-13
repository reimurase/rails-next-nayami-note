"use client";

import useSWR from "swr";

import RoadmapIndex from "@/components/roadmaps/RoadmapIndex";
import { roadmapApi } from "@/lib/api/roadmap";

export default function RoadmapPageClient() {
  const {
    data: roadmaps,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/roadmaps", () => roadmapApi.getRoadmaps());

  const refreshRoadmapList = async () => {
    await mutate();
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div>
      <RoadmapIndex roadmaps={roadmaps ?? []} onRoadmapListChanged={refreshRoadmapList} />
    </div>
  );
}
