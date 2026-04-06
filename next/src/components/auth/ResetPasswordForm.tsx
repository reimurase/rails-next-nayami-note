"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { passwordApi } from "@/lib/api/auth";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません。");
      setSubmitting(false);
      return;
    }

    try {
      await passwordApi.reset(token, password);
      router.replace("/login");
    } catch {
      setError("Failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return <p>無効なリンクです。</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>新しいパスワードを設定</h1>

      <label>
        新しいパスワード
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </label>

      <label>
        新しいパスワード（確認）
        <input
          name="password_confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="new-password"
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "再設定する"}
      </button>
    </form>
  );
};
