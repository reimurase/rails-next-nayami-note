"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import RoadmapRow from "./RoadmapRow";
import RoadmapDetail from "./RoadmapDetail";

import type { Roadmap } from "@/lib/roadmapApi";

type Props = {
  roadmaps: Roadmap[];
};

const RoadmapIndex = ({ roadmaps }: Props) => {
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
              <RoadmapRow roadmap={roadmap} onOpenDetail={() => setSelectedId(roadmap.id)} />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>{selectedId !== null && <RoadmapDetail id={selectedId} />}</DialogContent>
      </Dialog>
    </div>
  );
};

export default RoadmapIndex;
