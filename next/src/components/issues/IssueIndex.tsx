"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import ConcernDetailView from "../detail/ConcernDetailView";

import IssueRow from "./IssueRow";

import type { Issue } from "@/types/issue";

type Props = {
  issues: Issue[];
  onIssueListChanged?: () => void | Promise<void>;
};

const IssueIndex = ({ issues, onIssueListChanged }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleIssueDeleted = async () => {
    setSelectedId(null);
    await onIssueListChanged?.();
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
            問題一覧
          </Typography>

          {issues.length === 0 ? (
            <Typography color="text.secondary">まだ問題はありません</Typography>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
              {issues.map((issue) => (
                <li key={issue.concernId} style={{ listStyle: "none" }}>
                  <IssueRow
                    issue={issue}
                    onIssueListChanged={onIssueListChanged}
                    onOpenDetail={() => setSelectedId(issue.concernId)}
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
          onIssueListChanged={onIssueListChanged}
          onConcernDeleted={handleIssueDeleted}
        />
      </Box>
    </Box>
  );
};

export default IssueIndex;
