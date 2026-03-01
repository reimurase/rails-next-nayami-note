"use client";

import { useState } from "react";
import useSWR from "swr";

import RoadmapIndex from "@/components/roadmaps/RoadmapIndex";
import RoadmapCreateSheet from "@/components/roadmaps/RoadmapCreateSheet";
import { roadmapApi } from "@/lib/roadmapApi";

export default function RoadmapPageClient() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    data: roadmaps,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/roadmaps", () => roadmapApi.getRoadmaps());

  const refresh = async () => {
    await mutate();
  };

  const handleCreated = async () => {
    await refresh();
    setIsSheetOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div style={{ paddingBottom: isSheetOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsSheetOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <RoadmapIndex roadmaps={roadmaps ?? []} onChanged={refresh} />

      <RoadmapCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
