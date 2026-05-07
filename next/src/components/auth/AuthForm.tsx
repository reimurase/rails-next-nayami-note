"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mutate } from "swr";

import { authApi } from "@/lib/api/auth";
import { clearCsrfTokenCache } from "@/lib/api/csrf";
import { normalizeApiError } from "@/lib/api/error";
import {
  hasErrors,
  validateSignupOnSubmit,
  validateLoginOnSubmit,
  mapAuthValidationErrors,
  LOGIN_CREDENTIAL_ERROR,
  type AuthErrors,
  type SignupValues,
  type LoginValues,
} from "@/lib/validations/authValidation";

type Props = {
  mode: "signup" | "login";
};

export const AuthForm = ({ mode }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") ?? "/concerns";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<AuthErrors>({});

  const title = mode === "signup" ? "Signup" : "Login";
  const buttonLabel = mode === "signup" ? "Create account" : "Login";

  const signupValues: SignupValues = { email, password, passwordConfirmation };
  const loginValues: LoginValues = { email, password };

  const clientErrors: AuthErrors = submitted
    ? mode === "signup"
      ? validateSignupOnSubmit(signupValues)
      : validateLoginOnSubmit(loginValues)
    : {};

  const emailError = serverErrors.email ?? clientErrors.email;
  const passwordError = serverErrors.password ?? clientErrors.password;
  const passwordConfirmationError =
    serverErrors.passwordConfirmation ?? clientErrors.passwordConfirmation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError(null);
    setServerErrors({});

    const nextErrors =
      mode === "signup" ? validateSignupOnSubmit(signupValues) : validateLoginOnSubmit(loginValues);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);

    try {
      if (mode === "signup") {
        await authApi.signup({ email, password, password_confirmation: passwordConfirmation });
      } else {
        await authApi.login({ email, password });
      }
      clearCsrfTokenCache();
      await mutate("me", authApi.me());
      router.replace(next);
    } catch (err: unknown) {
      const appError = normalizeApiError(err);

      if (appError.type === "validation") {
        setServerErrors(mapAuthValidationErrors(appError.errors));
        return;
      }

      if (appError.type === "unauthorized") {
        setApiError(LOGIN_CREDENTIAL_ERROR);
        return;
      }

      if (appError.type === "network") {
        setApiError(appError.message);
        return;
      }

      setApiError("エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setSubmitting(true);
    setApiError(null);
    try {
      await authApi.guestLogin();
      clearCsrfTokenCache();
      await mutate("me", authApi.me());
      router.replace(next);
    } catch (err: unknown) {
      const appError = normalizeApiError(err);
      setApiError(
        appError.type === "network"
          ? appError.message
          : "エラーが発生しました。時間を置いて再度お試しください。"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>{title}</h1>

      {apiError && <p role="alert">{apiError}</p>}

      <label>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setServerErrors((prev) => ({ ...prev, email: undefined }));
          }}
          autoComplete="email"
        />
      </label>
      {emailError && <p role="alert">{emailError}</p>}

      <label>
        Password
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setServerErrors((prev) => ({ ...prev, password: undefined }));
          }}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {passwordError && <p role="alert">{passwordError}</p>}

      {mode === "signup" && (
        <>
          <label>
            Password confirmation
            <input
              name="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                setServerErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
              }}
              autoComplete="new-password"
            />
          </label>
          {passwordConfirmationError && <p role="alert">{passwordConfirmationError}</p>}
        </>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : buttonLabel}
      </button>

      {mode === "login" && <Link href="/reset-password">パスワードを忘れた方はこちら</Link>}
      <button type="button" onClick={handleGuestLogin} disabled={submitting}>
        ゲストとして試す
      </button>
    </form>
  );
};
