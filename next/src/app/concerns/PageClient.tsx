"use client";

import { useState } from "react";
import useSWR from "swr";

import ConcernIndex from "@/components/concerns/ConcernIndex";
import ConcernCreateSheet from "@/components/concerns/ConcernCreateSheet";
import AutoArchiveSetting from "@/components/settings/AutoArchiveSetting";
import { concernApi } from "@/lib/api/concern";
import { authApi } from "@/lib/api/auth";

export default function ConcernPageClient() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    data: concerns,
    error: concernsError,
    isLoading: concernsLoading,
    mutate: concernMutate,
  } = useSWR("/api/v1/concerns", () => concernApi.getConcerns());

  const {
    data: me,
    error: meError,
    isLoading: meLoading,
    mutate: meMutate,
  } = useSWR("/api/v1/me", () => authApi.me());

  const refreshConcernList = async () => {
    await concernMutate();
  };

  const refreshAutoArchive = async () => {
    await meMutate();
  };

  const handleCreated = async () => {
    await refreshConcernList();
    setIsSheetOpen(false);
  };

  if (concernsLoading || meLoading) return <div>読み込み中...</div>;
  if (concernsError) return <div>エラーが発生しました {String(concernsError)}</div>;
  if (meError) return <div>エラーが発生しました {String(meError)}</div>;
  if (!me) return <div>ユーザー情報の取得に失敗しました</div>;

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

      <div style={{ marginBottom: 16 }}>
        <AutoArchiveSetting enabled={me.autoArchiveEnabled} onUpdated={refreshAutoArchive} />
      </div>

      <ConcernIndex concerns={concerns ?? []} onConcernListChanged={refreshConcernList} />

      <ConcernCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
