"use client";

import ConcernForm from "./ConcernForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function ConcernCreateSheet({ isOpen, onClose, onCreated }: Props) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "16px",
        borderTop: "1px solid #ddd",
        backgroundColor: "#1a1a1a", // 夜モード風
        boxShadow: "0 -4px 12px rgba(0,0,0,0.4)",
        animation: "slideUp 0.25s ease-out",
      }}
    >
      <style>
        {`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        `}
      </style>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong style={{ color: "white" }}>悩みを追加</strong>
        <button onClick={onClose}>✕</button>
      </div>

      <ConcernForm onCreated={onCreated} />
    </div>
  );
}
