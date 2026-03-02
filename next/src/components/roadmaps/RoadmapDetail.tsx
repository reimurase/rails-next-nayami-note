"use client";

import useSWR from "swr";

import { roadmapApi } from "@/lib/roadmapApi";

type Props = {
  id: number;
};

export default function RoadmapDetail({ id }: Props) {
  const {
    data: roadmap,
    error,
    isLoading,
  } = useSWR(`/api/v1/roadmaps/${id}`, () => roadmapApi.getRoadmap(id));

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

  if (!roadmap) {
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
        <li>ゴール: {roadmap.goal}</li>
        <li>内容: {roadmap?.content}</li>
      </ul>
    </div>
  );
}
