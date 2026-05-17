"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import ConcernDetailView from "../detail/ConcernDetailView";

import ConcernRow from "./ConcernRow";

import type { Concern } from "@/types/concern";

type Props = {
  concerns: Concern[];
  onConcernListChanged?: () => void | Promise<void>;
};

const EMPTY_CARDS = [
  { title: "なやみ", message: "一覧からなやみを選択してください" },
  { title: "問題", message: "-" },
  { title: "ロードマップ", message: "-" },
];

const ConcernIndex = ({ concerns, onConcernListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConcernDeleted = async () => {
    setSelectedId(null);
    await onConcernListChanged?.();
  };

  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", minWidth: 0 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, minWidth: 200, maxWidth: 350 }}>
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
      </Card>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {selectedId !== null ? (
          <ConcernDetailView
            concernId={selectedId}
            onConcernListChanged={onConcernListChanged}
            onConcernDeleted={handleConcernDeleted}
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {EMPTY_CARDS.map(({ title, message }) => (
              <Card key={title} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography color="text.secondary">{message}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ConcernIndex;
