"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

import ConcernIndex from "@/components/concerns/ConcernIndex";
import ConcernCreateSheet from "@/components/concerns/ConcernCreateSheet";

export default function ConcernPage() {
  const { data, isLoading, error, mutate } = useSWR(
    "http://localhost:3000/api/v1/concerns",
    (url) => axios.get(url).then((res) => res.data)
  );

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCreated = () => {
    mutate();
    setIsSheetOpen(false);
  };

  return (
    <div style={{ paddingBottom: isSheetOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>悩み一覧</h1>

        <button
          onClick={() => setIsSheetOpen(true)}
          style={{
            fontSize: 24,
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        >
          +
        </button>
      </header>

      <ConcernIndex concerns={data} isLoading={isLoading} error={error} onChanged={mutate} />

      <ConcernCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
