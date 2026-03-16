"use client";

import ConcernDeleteButton from "./ConcernDeleteButton";

import type { Concern } from "@/types/concern";

type Props = {
  concern: Concern;
  onChanged?: () => void; // 更新 or 削除が成功したときに一覧を更新する用
  onOpenDetail?: () => void;
};

const ConcernRow = ({ concern, onChanged, onOpenDetail }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
      <div onClick={onOpenDetail}>
        <span>{concern.triggerEvent}</span>
        <span>{concern.content}</span>
      </div>

      {/* 既存の削除ボタンはそのまま使える */}
      <ConcernDeleteButton
        id={concern.id}
        onDeleted={onChanged} // 削除成功時も一覧更新
      />
    </div>
  );
};

export default ConcernRow;
