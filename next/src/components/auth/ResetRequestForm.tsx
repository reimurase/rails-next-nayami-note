"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockResetIcon from "@mui/icons-material/LockReset";

import { passwordApi } from "@/lib/api/auth";
import { normalizeApiError } from "@/lib/api/error";

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
    } catch (err: unknown) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box display="flex" justifyContent="center" pt={12}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, textAlign: "center" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              メールを送信しました
            </Typography>
            <Typography variant="body2" color="text.secondary">
              受信ボックスをご確認ください。
            </Typography>
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
              パスワードの再設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              登録済みのメールアドレスを入力してください
            </Typography>
          </Stack>

          <Stack component="form" onSubmit={handleSubmit} spacing={2} width="100%">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              fullWidth
              required
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              {submitting ? "送信中..." : "送信する"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
