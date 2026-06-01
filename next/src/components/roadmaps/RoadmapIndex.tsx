"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import ConcernDetailView from "../detail/ConcernDetailView";

import RoadmapRow from "./RoadmapRow";

import { Roadmap } from "@/types/roadmap";

type Props = {
  roadmaps: Roadmap[];
  onRoadmapListChanged?: () => void;
};

const RoadmapIndex = ({ roadmaps, onRoadmapListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleRoadmapDeleted = async () => {
    setSelectedId(null);
    onRoadmapListChanged?.();
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
            ロードマップ一覧
          </Typography>

          {roadmaps.length === 0 ? (
            <Typography color="text.secondary">まだロードマップはありません</Typography>
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
        </CardContent>
      </Card>

      {/* 右カラム： 詳細 */}
      <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
        <ConcernDetailView
          concernId={selectedId}
          onRoadmapListChanged={onRoadmapListChanged}
          onConcernDeleted={handleRoadmapDeleted}
        />
      </Box>
    </Box>
  );
};

export default RoadmapIndex;
