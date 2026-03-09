"use client";

import useSWR from "swr";

import type { ConcernDetailResponse } from "@/types/concern";
import { concernApi } from "@/lib/api/concern";

type Props = {
  id: number;
};

export default function ConcernDetail({ id }: Props) {
  const {
    data: detail,
    error,
    isLoading,
  } = useSWR<ConcernDetailResponse>(`/api/v1/concerns/${id}`, () => concernApi.getConcern(id));

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
        <p>issue はありません</p>
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
