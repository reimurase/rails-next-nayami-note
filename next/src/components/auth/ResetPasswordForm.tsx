"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockResetIcon from "@mui/icons-material/LockReset";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [tokenErrorType, setTokenErrorType] = useState<"invalid" | "expired" | null>(null);

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
      const normalized = normalizeApiError(err);
      if (normalized.type === "token_error") {
        setTokenErrorType(normalized.code === "token_expired" ? "expired" : "invalid");
      } else {
        setApiError(normalized.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || tokenErrorType) {
    const heading =
      tokenErrorType === "expired" ? "リンクの有効期限が切れています" : "リンクが無効です";
    const description =
      tokenErrorType === "expired"
        ? "パスワード再設定リンクの有効期限（1時間）が切れています。もう一度やり直してください。"
        : "リンクが無効か、すでに使用済みの可能性があります。もう一度やり直してください。";

    return (
      <Box display="flex" justifyContent="center" pt={12}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, textAlign: "center" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {heading}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Button variant="contained" href="/reset-password">
              再設定メールを送り直す
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" pt={12}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <LockResetIcon />
          </Avatar>

          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              新しいパスワードを設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              8文字以上で入力してください
            </Typography>
          </Stack>

          <Stack component="form" onSubmit={handleSubmit} spacing={2} width="100%">
            <TextField
              label="新しいパスワード"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password}
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

            <TextField
              label="新しいパスワード（確認）"
              name="password_confirmation"
              type={showPasswordConfirmation ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation}
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

            {apiError && <Alert severity="error">{apiError}</Alert>}

            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              {submitting ? "送信中..." : "再設定する"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
