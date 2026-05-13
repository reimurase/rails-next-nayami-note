"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

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
    <Card variant="outlined" sx={{ borderRadius: 3, minWidth: 300, maxWidth: 650 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          なやみ一覧
        </Typography>

        {concerns.length === 0 ? (
          <Typography color="text.secondary">まだなやみはありません</Typography>
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
      </CardContent>

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
    </Card>
  );
};

export default ConcernIndex;
