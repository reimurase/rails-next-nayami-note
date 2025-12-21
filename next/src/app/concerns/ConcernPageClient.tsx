"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConcernIndex, { type Concern } from "@/components/concerns/ConcernIndex";
import ConcernCreateSheet from "@/components/concerns/ConcernCreateSheet";

export default function ConcernPageClient({ initialConcerns }: { initialConcerns: Concern[] }) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const refresh = () => {
    router.refresh();
  };

  const handleCreated = () => {
    refresh();
    setIsSheetOpen(false);
  };

  return (
    <div style={{ paddingBottom: isSheetOpen ? 160 : 0 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => setIsSheetOpen(true)}
          style={{ fontSize: 24, width: 40, height: 40, borderRadius: "50%" }}
        >
          +
        </button>
      </header>

      <ConcernIndex concerns={initialConcerns} onChanged={refresh} />

      <ConcernCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
