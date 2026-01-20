"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";

import { authApi } from "@/lib/authApi";

type Props = {
  mode: "signup" | "login";
};

function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const data = (err as any).response?.data;
    if (data && typeof data === "object") {
      const maybeError = (data as any).error;
      const maybeErrors = (data as any).errors;

      if (typeof maybeError === "string" && maybeError.length > 0) return maybeError;
      if (Array.isArray(maybeErrors) && maybeErrors.every((x) => typeof x === "string")) {
        return maybeErrors.join(", ");
      }
    }
  }
  return "Failed. Please check your email/password.";
}

export const AuthForm = ({ mode }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") ?? "/concerns";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === "signup" ? "Signup" : "Login";
  const buttonLabel = mode === "signup" ? "Create account" : "Login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (mode === "signup" && password !== passwordConfirmation) {
      setError("Password confirmation doesn't match.");
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "signup") {
        await authApi.signup({ email, password, password_confirmation: passwordConfirmation });
      } else {
        await authApi.login({ email, password });
      }
      const meRes = await authApi.me();
      mutate("me", meRes.data, false);

      router.replace(next);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>

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

      <label>
        Password
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>

      {mode === "signup" && (
        <label>
          Password confirmation
          <input
            name="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
          />
        </label>
      )}

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : buttonLabel}
      </button>
    </form>
  );
};
