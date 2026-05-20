"use client";

import { useState } from "react";
import useSWR from "swr";

import RoadmapIndex from "@/components/roadmaps/RoadmapIndex";
import ConcernCreateDialog from "@/components/concerns/ConcernCreateDialog";
import { roadmapApi } from "@/lib/api/roadmap";

export default function PageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: roadmaps,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/roadmaps/archived", () => roadmapApi.getArchivedRoadmaps());

  const refreshRoadmapList = async () => {
    await mutate();
  };

  const handleCreated = async () => {
    await refreshRoadmapList();
    setIsDialogOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div style={{ paddingBottom: isDialogOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <RoadmapIndex roadmaps={roadmaps ?? []} onRoadmapListChanged={refreshRoadmapList} />

      <ConcernCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
