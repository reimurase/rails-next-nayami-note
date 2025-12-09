"use client";

import ConcernRow from "./ConcernRow";

export type Concern = {
  id: number;
  content: string;
};

type ConcernIndexProps = {
  concerns?: Concern[];
  isLoading: boolean;
  error?: Error | null;
  onChanged?: () => void;
};

export default function ConcernIndex({ concerns, isLoading, error, onChanged }: ConcernIndexProps) {
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

  return (
    <div>
      <h2>concern 一覧</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
        {concerns.map((concern) => (
          <li key={concern.id} style={{ listStyle: "none" }}>
            <ConcernRow concern={concern} onChanged={onChanged} />
          </li>
        ))}
      </ul>
    </div>
  );
}
