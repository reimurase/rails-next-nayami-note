import { Button, Typography, Box } from "@mui/material";

import { ClientHealthCheck } from "@/components/ClientHealthCheck";

const API_BASE_URL = "http://localhost:3000";

export default async function HomePage() {
  let message;

  if (process.env.NODE_ENV === "development") {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health_check`, {
        cache: "no-store",
      });
      const data = await res.json();
      message = data.message;
    } catch {
      message = "開発中にfetch失敗しました";
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        なやみノート
      </Typography>
      <Button variant="contained" color="primary">
        投稿する
      </Button>
      <main>
        <h1>疎通チェック</h1>
        <p>Server fetch: {message}</p>
        <ClientHealthCheck />
      </main>
    </Box>
  );
}
