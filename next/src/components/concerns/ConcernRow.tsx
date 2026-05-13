"use client";

import { Typography } from "@mui/material";

import ConcernDeleteButton from "./ConcernDeleteButton";
import ConcernArchiveButton from "./ConcernArchiveButton";

import type { Concern } from "@/types/concern";

type Props = {
  concern: Concern;
  onConcernListChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
  onOpenDetail?: () => void;
};

const TRIGGER_EVENT_LINE_LIMIT = 2;
const CONTENT_LINE_LIMIT = 3;

const ConcernRow = ({ concern, onConcernListChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
      <div onClick={onOpenDetail}>
        <Typography
          variant="body1"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: TRIGGER_EVENT_LINE_LIMIT,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {concern.triggerEvent}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: CONTENT_LINE_LIMIT,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {concern.content}
        </Typography>
      </div>

      {/* 既存の削除ボタンはそのまま使える */}
      <ConcernDeleteButton
        id={concern.id}
        onDeleted={onConcernListChanged} // 削除成功時も一覧更新
      />

      <ConcernArchiveButton
        id={concern.id}
        archivedAt={concern.archivedAt}
        onArchiveChanged={onConcernListChanged}
      />
    </div>
  );
};

export default ConcernRow;
