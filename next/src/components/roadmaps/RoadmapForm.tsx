"use client";

import { useState } from "react";

import { roadmapApi } from "@/lib/api/roadmap";

type RoadmapFormProps = {
  concernId: number;
  onCreated: () => void;
};

const RoadmapForm = ({ concernId, onCreated }: RoadmapFormProps) => {
  const [goal, setGoal] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await roadmapApi.create(concernId, { goal, content });

      setGoal("");
      setContent("");
      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="ゴール（任意）"
        value={goal}
        onChange={(e) => {
          setGoal(e.target.value);
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      <textarea
        placeholder="ロードマップ（任意）"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        rows={4}
        style={{
          width: "600px",
          padding: "8px",
          fontSize: "16px",
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          marginLeft: "8px",
          padding: "8px 16px",
          fontSize: "16px",
        }}
      >
        {isSubmitting ? "追加中..." : "追加"}
      </button>
    </form>
  );
};

export default RoadmapForm;
