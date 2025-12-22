"use client";

import { useState } from "react";

import { concernApi } from "@/lib/concernApi";

type Props = {
  id: number;
  onDeleted?: () => void; // 正常終了時に呼びたい処理（一覧の更新など）
};

const ConcernDeleteButton = ({ id, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    // 確認ダイアログ（あとで消してもOK）
    const ok = window.confirm("本当に削除しますか？");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await concernApi.remove({ id });

      // 正常系でやりたいこと（一覧の再取得など）
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      // 異常系はとりあえずログだけ
      console.error(error);
      // 余裕が出てきたらUIでエラー表示を足す
      // alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isDeleting}>
      {isDeleting ? "削除中..." : "削除"}
    </button>
  );
};

export default ConcernDeleteButton;
