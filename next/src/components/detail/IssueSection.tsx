"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import IssueArchiveButton from "../issues/IssueArchiveButton";
import IssueDeleteButton from "../issues/IssueDeleteButton";
import IssueForm from "../issues/IssueForm";

import IssueEditor from "./IssueEditor";

import type { Issue } from "@/types/issue";

type Props = {
  concernId: number;
  issue: Issue | null;
  onIssueChanged?: () => void | Promise<void>;
  onIssueArchived?: () => void | Promise<void>;
};

export default function IssueSection({ concernId, issue, onIssueChanged, onIssueArchived }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
            <IssueForm concernId={concernId} onCreated={handleCreated} />
          )}
        </>
      ) : isEditing ? (
        <IssueEditor
          concernId={concernId}
          issue={issue}
          onSaved={handleSaved}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <IssueArchiveButton
              issueId={issue.id}
              archivedAt={issue.archivedAt}
              onArchiveChanged={onIssueArchived}
            />
            <IssueDeleteButton concernId={concernId} onDeleted={onIssueChanged} />
            <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
              編集
            </Button>
          </Stack>

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
        </Box>
      )}
    </Box>
  );
}
