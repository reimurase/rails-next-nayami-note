"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import ConcernDetailView from "../detail/ConcernDetailView";

import RoadmapRow from "./RoadmapRow";

import { Roadmap } from "@/types/roadmap";

type Props = {
  roadmaps: Roadmap[];
  onRoadmapListChanged?: () => void;
};

const RoadmapIndex = ({ roadmaps, onRoadmapListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div>
      <h2>ロードマップ一覧</h2>

      {roadmaps.length === 0 ? (
        <p>まだロードマップはありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {roadmaps.map((roadmap) => (
            <li key={roadmap.id} style={{ listStyle: "none" }}>
              <RoadmapRow
                roadmap={roadmap}
                onRoadmapListChanged={onRoadmapListChanged}
                onOpenDetail={() => setSelectedId(roadmap.concernId)}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>
          {selectedId !== null && (
            <ConcernDetailView concernId={selectedId} onRoadmapListChanged={onRoadmapListChanged} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoadmapIndex;
