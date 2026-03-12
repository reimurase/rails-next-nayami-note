"use client";

import { useState } from "react";

import type { Issue } from "@/types/issue";
import { issueApi } from "@/lib/api/issue";

type Props = {
  concernId: number;
  issue: Issue;
  onSaved?: () => void | Promise<void>;
  onCancel: () => void;
};

export default function IssueEditor({ concernId, issue, onSaved, onCancel }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(issue.title || "");
  const [content, setContent] = useState(issue.content || "");

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await issueApi.update(concernId, { title, content });
      await onSaved?.();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <textarea
        value={title}
        placeholder="タイトル（任意）"
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
      />

      <textarea
        value={content}
        placeholder="問題（必須）"
        onChange={(e) => setContent(e.target.value)}
        disabled={isSaving}
      />

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "保存中..." : "保存"}
      </button>

      <button onClick={onCancel} disabled={isSaving}>
        キャンセル
      </button>
    </div>
  );
}
