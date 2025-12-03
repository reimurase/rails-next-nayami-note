"use client";

import { useState } from "react";
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

export default function ConcernEdit({ id }: Props) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"" | "送信中..." | "更新成功" | "エラー">("");

  const {
    data: concern,
    error,
    isLoading,
    mutate,
  } = useSWR(`http://localhost:3000/api/v1/concerns/${id}`, fetcher, {
    onSuccess: (data) => {
      setContent(data.content);
    },
  });

  // // concern が取得できたらフォームの初期値としてセット
  // useEffect(() => {
  //   if (concern) {
  //     setContent(concern.content);
  //   }
  // }, [concern]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setStatus("エラー");
      return;
    }

    setStatus("送信中...");

    try {
      const res = await axios.patch<Concern>(`http://localhost:3000/api/v1/concerns/${id}`, {
        concern: { content },
      });

      // SWR のキャッシュも更新しておくと詳細ページなどと整合が取れる
      await mutate(res.data, false);

      setStatus("更新成功");
    } catch (error) {
      console.error(error);
      setStatus("エラー");
    }
  };

  // ローディング
  if (isLoading) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>悩み編集ページ</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>悩み編集ページ</h2>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  // データなし
  if (!concern) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>悩み編集ページ</h2>
        <p>データが見つかりませんでした</p>
      </div>
    );
  }

  // 通常表示
  return (
    <div style={{ padding: "24px" }}>
      <h1>悩みを編集</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "300px",
            padding: "8px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          disabled={status === "送信中..."}
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            fontSize: "16px",
          }}
        >
          {status === "送信中..." ? "更新中..." : "更新"}
        </button>
      </form>

      {status === "更新成功" && <p style={{ color: "green" }}>更新に成功しました</p>}
      {status === "エラー" && <p style={{ color: "red" }}>エラーが発生しました</p>}
    </div>
  );
}
