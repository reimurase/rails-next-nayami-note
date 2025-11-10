import { Button, Typography, Box } from "@mui/material";

import { ClientHealthCheck } from "@/components/ClientHealthCheck";

export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/v1/health_check");
  const data = await res.json();

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
        <p>Server fetch: {data.message}</p>
        <ClientHealthCheck />
      </main>
    </Box>
  );
}
