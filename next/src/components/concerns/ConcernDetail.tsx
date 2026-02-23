"use client";

import useSWR from "swr";

import type { Concern } from "./ConcernIndex.tsx";

import { concernApi } from "@/lib/concernApi";

type Props = {
  id: number;
};

export default function ConcernDetail({ id }: Props) {
  const {
    data: concern,
    error,
    isLoading,
  } = useSWR<Concern>(`/api/v1/concerns/${id}`, () => concernApi.getConcern({ id }));

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

  if (!concern) {
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
      <ul>
        <li>きっかけ: {concern.trigger_event}</li>
        <li>内容: {concern?.content}</li>
      </ul>
    </div>
  );
}
