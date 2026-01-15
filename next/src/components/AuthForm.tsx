"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/authApi";

type Props = {
  mode: "signup" | "login";
};

export const AuthForm = ({ mode }: Props) => {
  const router = useRouter();

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

    try {
      if (mode === "signup") {
        await authApi.signup({ email, password, password_confirmation: passwordConfirmation });
      } else {
        await authApi.login({ email, password });
      }
      router.push("/concerns");
    } catch (err: unknown) {
      // axios error っぽい時だけレスポンスから拾う
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data === "object"
          ? ((err as any).response.data.error ??
            (err as any).response.data.errors?.join(", ") ??
            "Failed. Please check your email/password.")
          : "Failed. Please check your email/password.";

      setError(message);
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
