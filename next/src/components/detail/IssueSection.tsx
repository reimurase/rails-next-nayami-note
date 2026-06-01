"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import IssueForm from "../issues/IssueForm";

import IssueEditor from "./IssueEditor";

import { issueApi } from "@/lib/api/issue";
import type { Issue } from "@/types/issue";

type Props = {
  concernId: number;
  issue: Issue | null;
  onIssueChanged?: () => void | Promise<void>;
};

export default function IssueSection({ concernId, issue, onIssueChanged }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isArchived = issue?.archivedAt !== null;

  const handleSaved = async () => {
    setIsEditing(false);

    // issueページ / 詳細のissueを更新
    await onIssueChanged?.();
  };

  const handleCreated = async () => {
    setIsCreating(false);

    // issueページ / 詳細のissueを更新
    await onIssueChanged?.();
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      setIsProcessing(true);
      setApiError(null);
      await issueApi.remove(concernId);
      await onIssueChanged?.();
    } catch (error) {
      console.error(error);
      setApiError("削除に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    if (!issue) return;
    if (
      !window.confirm(
        isArchived ? "本当にノートへ戻しますか？" : "本当にライブラリへ移動しますか？"
      )
    )
      return;
    try {
      setIsProcessing(true);
      setApiError(null);
      if (isArchived) {
        await issueApi.unarchiveIssue(issue.id);
      } else {
        await issueApi.archiveIssue(issue.id);
      }
      await onIssueChanged?.();
    } catch (error) {
      console.error(error);
      setApiError(isArchived ? "戻すのに失敗しました" : "移動に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        問題
      </Typography>

      {!issue ? (
        <>
          {!isCreating ? (
            <Box>
              <Typography sx={{ mb: 1 }}>問題はありません</Typography>
              <Button variant="outlined" size="small" onClick={() => setIsCreating(true)}>
                新規作成
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <IssueForm concernId={concernId} onCreated={handleCreated} />
            </Box>
          )}
        </>
      ) : (
        <>
          {apiError && (
            <Alert severity="error" onClose={() => setApiError(null)} sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" onClick={handleArchive} disabled={isProcessing}>
              {isArchived ? "ノートへ戻す" : "ライブラリへ"}
            </Button>

            {!isEditing && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleDelete}
                  disabled={isProcessing}
                >
                  削除
                </Button>

                <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
                  編集
                </Button>
              </>
            )}
          </Stack>

          {isEditing ? (
            <IssueEditor
              concernId={concernId}
              issue={issue}
              onSaved={handleSaved}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  タイトル
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {issue.title || "なし"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  内容
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {issue.content}
                </Typography>
              </Box>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
