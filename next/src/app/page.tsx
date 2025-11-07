import { Button, Typography, Box } from "@mui/material";

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        なやみノート
      </Typography>
      <Button variant="contained" color="primary">
        投稿する
      </Button>
    </Box>
  );
}
