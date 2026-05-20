"use client";

import { useState } from "react";
import useSWR from "swr";

import ConcernIndex from "@/components/concerns/ConcernIndex";
import ConcernCreateDialog from "@/components/concerns/ConcernCreateDialog";
import { concernApi } from "@/lib/api/concern";

export default function PageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: concerns,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/v1/concerns/archived", () => concernApi.getArchivedConcerns());

  const refreshConcernList = async () => {
    await mutate();
  };

  const handleCreated = async () => {
    await refreshConcernList();
    setIsDialogOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div style={{ paddingBottom: isDialogOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <ConcernIndex concerns={concerns ?? []} onConcernListChanged={refreshConcernList} />

      <ConcernCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
