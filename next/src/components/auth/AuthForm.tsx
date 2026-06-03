"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { mutate } from "swr";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
import { safeNext } from "@/utils/safeNext";

type Props = {
  mode: "signup" | "login";
};

export const AuthForm = ({ mode }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = safeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<AuthErrors>({});

  const title = mode === "signup" ? "アカウントを作成" : "ログイン";
  const buttonLabel = mode === "signup" ? "アカウントを作成" : "ログイン";

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

      if (appError.type === "rate_limited") {
        setApiError(appError.message);
        return;
      }

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

      if (appError.type === "network" || appError.type === "rate_limited") {
        setApiError(appError.message);
        return;
      }

      setApiError("エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" pt={12}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {mode === "signup" ? <PersonAddIcon /> : <LockIcon />}
          </Avatar>

          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Stack component="form" onSubmit={handleSubmit} noValidate spacing={4} width="100%">
            <TextField
              label="メールアドレス"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setServerErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
              error={!!emailError}
              helperText={emailError}
              fullWidth
            />

            <TextField
              label="パスワード"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setServerErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              error={!!passwordError}
              helperText={
                passwordError ?? (mode === "signup" ? "8文字以上で入力してください" : undefined)
              }
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {mode === "signup" && (
              <TextField
                label="パスワード（確認）"
                name="password_confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setServerErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
                }}
                autoComplete="new-password"
                error={!!passwordConfirmationError}
                helperText={passwordConfirmationError}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordConfirmation((v) => !v)}
                          edge="end"
                          aria-label={
                            showPasswordConfirmation ? "パスワードを隠す" : "パスワードを表示する"
                          }
                        >
                          {showPasswordConfirmation ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}

            {apiError && <Alert severity="error">{apiError}</Alert>}

            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              {submitting ? "Submitting..." : buttonLabel}
            </Button>

            {mode === "login" && (
              <>
                <MuiLink
                  component={NextLink}
                  href="/reset-password"
                  variant="body2"
                  textAlign="center"
                >
                  パスワードを忘れた方はこちら
                </MuiLink>
                <Button component={NextLink} href="/signup" variant="outlined" fullWidth>
                  アカウントを作成
                </Button>
              </>
            )}

            {mode === "signup" && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleGuestLogin}
                disabled={submitting}
                fullWidth
              >
                ゲストとして試す
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
