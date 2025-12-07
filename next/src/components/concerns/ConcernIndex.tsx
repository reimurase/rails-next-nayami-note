"use client";

import axios from "axios";
import useSWR from "swr";
// import Link from "next/link";

import ConcernRow from "./ConcernRow";
// import ConcernDeleteButton from "./ConcernDeleteButton";

export type Concern = {
  id: number;
  content: string;
};

const fetcher = (url: string) => axios.get<Concern[]>(url).then((res) => res.data);

export default function ConcernIndex() {
  const {
    data: concerns,
    error,
    isLoading,
    mutate,
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
    console.error(error);
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

  // return (
  //   <div>
  //     <h2>悩み一覧</h2>
  //     <ul>
  //       {concerns.map((concern) => (
  //         <li key={concern.id}>
  //           <Link href={`/concerns/${concern.id}`}>{concern.content}</Link>
  //           <Link href={`/concerns/${concern.id}/edit`}>編集</Link>
  //           <ConcernDeleteButton
  //             id={concern.id}
  //             onDeleted={() => {
  //               // 正常系：削除後に一覧を更新する
  //               mutate();
  //             }}
  //           />
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
  return (
    <div>
      <h2>concern 一覧</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
        {concerns.map((concern) => (
          <li key={concern.id} style={{ listStyle: "none" }}>
            <ConcernRow concern={concern} onChanged={() => mutate()} />
          </li>
        ))}
      </ul>
    </div>
  );
}
