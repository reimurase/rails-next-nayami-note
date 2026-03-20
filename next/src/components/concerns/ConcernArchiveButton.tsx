"use client";

import { useState } from "react";

import { concernApi } from "@/lib/api/concern";

type Props = {
  id: number;
  onArchived?: () => void | Promise<void>; // 正常終了時に呼びたい処理（一覧の更新など）
};

const ConcernArchiveButton = ({ id, onArchived }: Props) => {
  const [isArchiving, setIsArchiving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleClick = async () => {
    // 確認ダイアログ
    const ok = window.confirm("本当にライブラリへ移動しますか？");
    if (!ok) return;

    try {
      setIsArchiving(true);
      setApiError(null);

      await concernApi.archive(id);

      await onArchived?.();
    } catch (error) {
      console.error(error);
      setApiError("移動に失敗しました");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      {apiError && (
        <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
          {apiError}
        </p>
      )}
      <button onClick={handleClick} disabled={isArchiving}>
        {isArchiving ? "移動中..." : "ライブラリへ"}
      </button>
    </>
  );
};

export default ConcernArchiveButton;
