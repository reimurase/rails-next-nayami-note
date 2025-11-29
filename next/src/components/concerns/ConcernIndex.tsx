"use client";

import axios from "axios";
import useSWR from "swr";

type Concern = {
  id: number;
  content: string;
};

const fetcher = (url: string) => axios.get<Concern[]>(url).then((res) => res.data);

export default function ConcernIndex() {
  const { data: concerns } = useSWR("http://localhost:3000/api/v1/concerns", fetcher);

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
