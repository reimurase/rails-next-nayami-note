"use client";

import { mutate } from "swr";
import { Box, Typography, Paper } from "@mui/material";

import ConcernForm from "@/components/concerns/ConcernForm";

export default function ConcernNewPageClient() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
        <Typography variant="h6" component="h1">
          なやみを書く
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <ConcernForm onCreated={() => mutate("/api/v1/concerns")} />
      </Paper>
    </Box>
  );
}
