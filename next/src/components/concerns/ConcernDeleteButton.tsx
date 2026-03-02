"use client";

import { useState } from "react";

import { concernApi } from "@/lib/api/concern";

type Props = {
  id: number;
  onDeleted?: () => void; // 正常終了時に呼びたい処理（一覧の更新など）
};

const ConcernDeleteButton = ({ id, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleClick = async () => {
    // 確認ダイアログ（あとで消してもOK）
    const ok = window.confirm("本当に削除しますか？");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await concernApi.remove(id);

      // 正常系でやりたいこと（一覧の再取得など）
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error(error);
      setApiError("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {apiError && (
        <p role="alert" style={{ color: "tomato", fontSize: 12 }}>
          {apiError}
        </p>
      )}
      <button onClick={handleClick} disabled={isDeleting}>
        {isDeleting ? "削除中..." : "削除"}
      </button>
    </>
  );
};

export default ConcernDeleteButton;
