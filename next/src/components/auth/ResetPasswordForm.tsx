"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  type AuthErrors,
  hasErrors,
  validateResetPasswordOnSubmit,
} from "@/lib/validations/authValidation";
import { passwordApi } from "@/lib/api/auth";
import { normalizeApiError } from "@/lib/api/error";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateResetPasswordOnSubmit(password, passwordConfirmation);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setSubmitting(true);

    try {
      await passwordApi.reset(token, password);
      router.replace("/login");
    } catch (err) {
      setApiError(normalizeApiError(err).message);
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
        {errors.password && <p role="alert">{errors.password}</p>}
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
        {errors.passwordConfirmation && <p role="alert">{errors.passwordConfirmation}</p>}
      </label>

      {apiError && <p role="alert">{apiError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "再設定する"}
      </button>
    </form>
  );
};
