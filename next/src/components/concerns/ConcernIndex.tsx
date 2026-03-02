"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import ConcernRow from "./ConcernRow";
import ConcernDetail from "./ConcernDetail";

import type { Concern } from "@/types/concern";

type Props = {
  concerns: Concern[];
  onChanged?: () => void;
};

const ConcernIndex = ({ concerns, onChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
                onChanged={onChanged}
                onOpenDetail={() => setSelectedId(concern.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth>
        <DialogContent>{selectedId !== null && <ConcernDetail id={selectedId} />}</DialogContent>
      </Dialog>
    </div>
  );
};

export default ConcernIndex;
