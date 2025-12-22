"use client";

export default function Error({ error }: { error: Error }) {
  console.error(error);

  return (
    <div>
      <h2>なやみ一覧</h2>
      <p>エラーが発生しました</p>
    </div>
  );
}
