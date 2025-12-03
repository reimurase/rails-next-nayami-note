"use client";

import Link from "next/link";
import axios from "axios";
import useSWR from "swr";

export type Concern = {
  id: number;
  content: string;
};

const fetcher = (url: string) => axios.get<Concern>(url).then((res) => res.data);

type Props = {
  id: number;
};

export default function ConcernDetail({ id }: Props) {
  const {
    data: concern,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/api/v1/concerns/${id}`, fetcher);

  if (isLoading) {
    return (
      <div>
        <h2>悩み詳細ページ</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>悩み詳細ページ</h2>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  if (!concern) {
    return (
      <div>
        <h2>悩み詳細ページ</h2>
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div>
      <h2>悩み詳細ページ</h2>
      <ul>
        <li>ID: {concern.id}</li>
        <li>内容: {concern.content}</li>
        <li>
          <Link href={`/concerns/${concern.id}/edit`}>編集</Link>
        </li>
      </ul>
    </div>
  );
}
