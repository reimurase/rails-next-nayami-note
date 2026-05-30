"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
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

const ConcernIndex = ({ concerns, onConcernListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConcernDeleted = async () => {
    setSelectedId(null);
    await onConcernListChanged?.();
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "stretch",
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* 左カラム： 一覧 */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, width: 200, flexShrink: 0, height: "100%", overflow: "auto" }}
      >
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

      {/* 右カラム： 詳細 */}
      <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
        <ConcernDetailView
          concernId={selectedId}
          onConcernListChanged={onConcernListChanged}
          onConcernDeleted={handleConcernDeleted}
        />
      </Box>
    </Box>
  );
};

export default ConcernIndex;
