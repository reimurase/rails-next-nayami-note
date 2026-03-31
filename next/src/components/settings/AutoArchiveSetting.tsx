"use client";

import { useState } from "react";

import { authApi } from "@/lib/api/auth";

type Props = {
  enabled: boolean;
  onUpdated?: () => void | Promise<void>;
};

export default function AutoArchiveSetting({ enabled, onUpdated }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await authApi.updateAutoArchive(!enabled);
      await onUpdated?.();
    } catch {
      setError("更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h3>自動アーカイブ</h3>
      <p>現在: {enabled ? "ON" : "OFF"}</p>

      <button onClick={handleToggle} disabled={isSaving}>
        {isSaving ? "更新中..." : enabled ? "OFFにする" : "ONにする"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}
