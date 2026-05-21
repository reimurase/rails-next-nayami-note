"use client";

import useSWR from "swr";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import ConcernSection from "./ConcernSection";
import IssueSection from "./IssueSection";
import RoadmapSection from "./RoadmapSection";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  concernId: number | null;
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
  } = useSWR<ConcernDetail>(concernId ? `/api/v1/concerns/${concernId}` : null, () =>
    concernApi.getConcern(concernId!)
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

  const renderConcernContent = () => {
    if (!concernId)
      return <Typography color="text.secondary">一覧からなやみを選択してください</Typography>;
    if (isLoading) return <CircularProgress size={20} />;
    if (error) return <Typography color="error">エラーが発生しました</Typography>;
    if (!detail) return <Typography color="text.secondary">データがありません</Typography>;
    return (
      <ConcernSection
        concern={detail.concern}
        onConcernUpdated={handleConcernChanged}
        onConcernDeleted={handleConcernDeleted}
        onConcernArchived={handleConcernChanged}
      />
    );
  };

  const renderIssueContent = () => {
    if (!concernId || isLoading || error || !detail)
      return <Typography color="text.secondary">—</Typography>;
    return (
      <IssueSection
        concernId={detail.concern.id}
        issue={detail.issue}
        onIssueChanged={handleIssueChanged}
        onIssueArchived={handleIssueChanged}
      />
    );
  };

  const renderRoadmapContent = () => {
    if (!concernId || isLoading || error || !detail)
      return <Typography color="text.secondary">—</Typography>;
    return (
      <RoadmapSection
        concernId={detail.concern.id}
        roadmap={detail.roadmap}
        onRoadmapChanged={handleRoadmapChanged}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>{renderConcernContent()}</CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>{renderIssueContent()}</CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>{renderRoadmapContent()}</CardContent>
      </Card>
    </Box>
  );
}
