"use client";

import useSWR from "swr";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const swrKey = concernId && concernId !== deletingId ? `/api/v1/concerns/${concernId}` : null;

  const {
    data: detail,
    error,
    isLoading,
    mutate,
  } = useSWR<ConcernDetail>(swrKey, () => concernApi.getConcern(concernId!));

  // SWR の revalidateOnFocus との競合を避けるため
  const deleteConcern = async (id: number) => {
    setDeletingId(id); // 購読を切る
    try {
      await concernApi.remove(id);
      await onConcernDeleted?.();
    } catch (e) {
      console.error(e);
      setDeletingId(null);
      setDeleteError("削除に失敗しました");
    }
  };

  const refreshDetail = async () => {
    await mutate();
  };

  // concernの一覧と詳細を更新
  const handleConcernChanged = async () => {
    await refreshDetail();
    await onConcernListChanged?.();
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
        key={detail.concern.id}
        concern={detail.concern}
        onConcernDelete={() => deleteConcern(detail.concern.id)}
        onConcernUpdated={handleConcernChanged}
        onConcernArchived={handleConcernChanged}
      />
    );
  };

  const renderIssueContent = () => {
    if (!concernId || isLoading || error || !detail)
      return <Typography color="text.secondary">—</Typography>;
    return (
      <IssueSection
        key={detail.concern.id}
        concernId={detail.concern.id}
        issue={detail.issue}
        onIssueChanged={handleIssueChanged}
      />
    );
  };

  const renderRoadmapContent = () => {
    if (!concernId || isLoading || error || !detail)
      return <Typography color="text.secondary">—</Typography>;
    return (
      <RoadmapSection
        key={detail.concern.id}
        concernId={detail.concern.id}
        roadmap={detail.roadmap}
        onRoadmapChanged={handleRoadmapChanged}
      />
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
        gap: 2,
        height: "100%",
      }}
    >
      <Card variant="outlined" sx={{ borderRadius: 3, overflow: "auto" }}>
        {deleteError && (
          <Alert severity="error" onClose={() => setDeleteError(null)} sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}
        <CardContent>{renderConcernContent()}</CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: "auto" }}>
        <CardContent>{renderIssueContent()}</CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: "auto" }}>
        <CardContent>{renderRoadmapContent()}</CardContent>
      </Card>
    </Box>
  );
}
