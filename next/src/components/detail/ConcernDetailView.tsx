"use client";

import { useState } from "react";
import useSWR from "swr";

import IssueCreateSheet from "../issues/IssueCreateSheet";

import type { ConcernDetail } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  id: number;
};

export default function ConcernDetailView({ id }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    data: detail,
    error,
    isLoading,
    mutate,
  } = useSWR<ConcernDetail>(`/api/v1/concerns/${id}`, () => concernApi.getConcern(id));

  const refresh = async () => {
    await mutate();
  };

  const handleCreated = async () => {
    await refresh();
    setIsSheetOpen(false);
  };

  if (isLoading) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div>
        <h2>詳細ページ</h2>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>詳細ページ</h2>

      <h3>Concern</h3>
      <ul>
        <li>きっかけ: {detail.concern.triggerEvent || "なし"}</li>
        <li>内容: {detail.concern.content}</li>
      </ul>

      <h3>Issue</h3>
      {detail.issue ? (
        <ul>
          <li>タイトル: {detail.issue.title || "なし"}</li>
          <li>内容: {detail.issue.content || "なし"}</li>
        </ul>
      ) : (
        <div>
          <p>issue はありません</p>
          <button onClick={() => setIsSheetOpen(true)}>新規作成</button>

          <IssueCreateSheet
            concernId={detail.concern.id}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onCreated={handleCreated}
          />
        </div>
      )}

      <h3>Roadmap</h3>
      {detail.roadmap ? (
        <ul>
          <li>目標: {detail.roadmap.goal || "なし"}</li>
          <li>内容: {detail.roadmap.content || "なし"}</li>
        </ul>
      ) : (
        <p>roadmap はありません</p>
      )}
    </div>
  );
}
