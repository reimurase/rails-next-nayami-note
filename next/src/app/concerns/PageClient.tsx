"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ConcernIndex from "@/components/concerns/ConcernIndex";
import ConcernCreateDialog from "@/components/concerns/ConcernCreateDialog";
import AutoArchiveSetting from "@/components/settings/AutoArchiveSetting";
import { concernApi } from "@/lib/api/concern";
import type { Me } from "@/types/auth";

export default function ConcernPageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: concerns,
    error: concernsError,
    isLoading: concernsLoading,
    mutate: concernMutate,
  } = useSWR("/api/v1/concerns", () => concernApi.getConcerns());

  const { data: me } = useSWR<Me>("me", null);

  const refreshConcernList = async () => {
    await concernMutate();
  };

  const refreshAutoArchive = async () => {
    await mutate("me");
  };

  const handleCreated = async () => {
    await refreshConcernList();
    setIsDialogOpen(false);
  };

  if (concernsLoading) return <div>読み込み中...</div>;
  if (concernsError) return <div>エラーが発生しました {String(concernsError)}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <IconButton color="primary" onClick={() => setIsDialogOpen(true)} aria-label="なやみを追加">
          <AddIcon />
        </IconButton>
      </header>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <AutoArchiveSetting
          enabled={me?.autoArchiveEnabled ?? false}
          onUpdated={refreshAutoArchive}
        />
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ConcernIndex concerns={concerns ?? []} onConcernListChanged={refreshConcernList} />
      </div>

      <ConcernCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
