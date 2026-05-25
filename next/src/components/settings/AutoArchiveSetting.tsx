"use client";

import { useState } from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import { authApi } from "@/lib/api/auth";

type Props = {
  enabled: boolean;
  onUpdated?: () => void | Promise<void>;
};

export default function AutoArchiveSetting({ enabled, onUpdated }: Props) {
  const [checked, setChecked] = useState(enabled);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const next = !checked;
    setChecked(next);
    setIsSaving(true);
    setError(null);

    try {
      await authApi.updateAutoArchive(next);
      await onUpdated?.();
    } catch {
      setChecked(!next);
      setError("更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch checked={checked} onChange={handleToggle} disabled={isSaving} size="small" />
        }
        label={
          <Typography variant="body2" color="text.secondary">
            自動ライブラリ
          </Typography>
        }
        labelPlacement="start"
        sx={{ mr: 0, gap: 0.5 }}
      />
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </>
  );
}
