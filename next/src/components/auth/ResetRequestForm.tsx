"use client";

import { useState } from "react";

import { passwordApi } from "@/lib/api/auth";

export const ResetRequestForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await passwordApi.resetRequest(email);
      setSubmitted(true);
    } catch {
      setError("Failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <p>メールを送信しました。受信ボックスをご確認ください。</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>パスワードの再設定</h1>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "送信する"}
      </button>
    </form>
  );
};
