"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import ConcernDetailView from "../detail/ConcernDetailView";

import ConcernRow from "./ConcernRow";

import type { Concern } from "@/types/concern";

type Props = {
  concerns: Concern[];
  onConcernListChanged?: () => void | Promise<void>;
};

const ConcernIndex = ({ concerns, onConcernListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConcernDeleted = async () => {
    setSelectedId(null);
    await onConcernListChanged?.();
  };

  return (
    <div>
      <h2>なやみ一覧</h2>

      {concerns.length === 0 ? (
        <p>まだなやみはありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {concerns.map((concern) => (
            <li key={concern.id} style={{ listStyle: "none" }}>
              <ConcernRow
                concern={concern}
                onConcernListChanged={onConcernListChanged}
                onOpenDetail={() => setSelectedId(concern.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>
          {selectedId !== null && (
            <ConcernDetailView
              concernId={selectedId}
              onConcernListChanged={onConcernListChanged}
              onConcernDeleted={handleConcernDeleted}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConcernIndex;
