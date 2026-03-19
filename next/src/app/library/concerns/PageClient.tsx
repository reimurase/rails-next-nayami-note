"use client";

import { useState } from "react";
import useSWR from "swr";

import ConcernIndex from "@/components/concerns/ConcernIndex";
import ConcernCreateSheet from "@/components/concerns/ConcernCreateSheet";
import { concernApi } from "@/lib/api/concern";

export default function PageClient() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    setIsSheetOpen(false);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました {String(error)}</div>;

  return (
    <div style={{ paddingBottom: isSheetOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsSheetOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <ConcernIndex concerns={concerns ?? []} onConcernListChanged={refreshConcernList} />

      <ConcernCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
