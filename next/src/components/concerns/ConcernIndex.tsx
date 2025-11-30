"use client";

import axios from "axios";
import useSWR from "swr";

type Concern = {
  id: number;
  content: string;
};

const fetcher = (url: string) => axios.get<Concern[]>(url).then((res) => res.data);

export default function ConcernIndex() {
  const {
    data: concerns,
    error,
    isLoading,
  } = useSWR("http://localhost:3000/api/v1/concerns", fetcher);

  if (isLoading) {
    return (
      <div>
        <h2>悩み一覧</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>悩み一覧</h2>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  if (!concerns) {
    return (
      <div>
        <h2>悩み一覧</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>悩み一覧</h2>
      <ul>
        {concerns.map((concern) => (
          <li key={concern.id}>{concern.content}</li>
        ))}
      </ul>
    </div>
  );
}
