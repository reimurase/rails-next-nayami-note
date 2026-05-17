"use client";

import useSWR from "swr";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

import ConcernSection from "./ConcernSection";
import IssueSection from "./IssueSection";
import RoadmapSection from "./RoadmapSection";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  concernId: number;
  onConcernListChanged?: () => void | Promise<void>;
  onIssueListChanged?: () => void | Promise<void>;
  onRoadmapListChanged?: () => void | Promise<void>;
  onConcernDeleted?: () => void | Promise<void>;
};

export default function ConcernDetailView({
  concernId,
  onConcernListChanged,
  onIssueListChanged,
  onRoadmapListChanged,
  onConcernDeleted,
}: Props) {
  const {
    data: detail,
    error,
    isLoading,
    mutate,
  } = useSWR<ConcernDetail>(`/api/v1/concerns/${concernId}`, () =>
    concernApi.getConcern(concernId)
  );

  const refreshDetail = async () => {
    await mutate();
  };

  // concernの一覧と詳細を更新
  const handleConcernChanged = async () => {
    await refreshDetail();
    await onConcernListChanged?.();
  };

  const handleConcernDeleted = async () => {
    await onConcernDeleted?.();
  };

  // issueの一覧と詳細を更新
  const handleIssueChanged = async () => {
    await refreshDetail();
    await onIssueListChanged?.();
  };

  // roadmapの一覧と詳細を更新
  const handleRoadmapChanged = async () => {
    await refreshDetail();
    await onRoadmapListChanged?.();
  };

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">読み込み中...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="error">エラーが発生しました</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!detail) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="text.secondary">データがありません</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <ConcernSection
            concern={detail.concern}
            onConcernUpdated={handleConcernChanged}
            onConcernDeleted={handleConcernDeleted}
            onConcernArchived={handleConcernChanged}
          />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <IssueSection
            concernId={detail.concern.id}
            issue={detail.issue}
            onIssueChanged={handleIssueChanged}
            onIssueArchived={handleIssueChanged}
          />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <RoadmapSection
            concernId={detail.concern.id}
            roadmap={detail.roadmap}
            onRoadmapChanged={handleRoadmapChanged}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
