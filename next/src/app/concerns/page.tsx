"use client";

import { useState } from "react";
import axios from "axios";

export default function ConcernPage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("送信中...");

    try {
      const res = await axios.post("http://localhost:3000/api/v1/concerns", {
        concern: { content },
      });

      setStatus("登録成功！");
      setContent("");
      console.warn(res.data);
    } catch (error) {
      console.error(error);
      setStatus("エラーが発生しました");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>悩みを追加</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="悩みを入力"
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
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            fontSize: "16px",
          }}
        >
          追加
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
