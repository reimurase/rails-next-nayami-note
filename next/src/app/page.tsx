"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import NextLink from "next/link";

const brick = "#7fc3fb";
const boxBorder = "#c9ccd1";
const boxBg = "#f7f8fa";

const features = [
  {
    Icon: EditNoteOutlinedIcon,
    title: "なやみ",
    lines: ["漠然としたなやみを", "そのまま書き出す"],
  },
  { Icon: ReportProblemIcon, title: "問題", lines: ["なやみを具体的な", "課題へと分解する"] },
  {
    Icon: MapOutlinedIcon,
    title: "ロードマップ",
    lines: ["課題を俯瞰して", "進む順番を見通す"],
  },
];

export default function NayamiNoteLanding() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Hero */}
      <Box
        sx={{
          border: `1px solid ${boxBorder}`,
          borderRadius: 1,
          bgcolor: boxBg,
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, letterSpacing: "0.05em" }}>
          なやみノート
        </Typography>
        <Divider
          sx={{
            my: 3,
            mx: "auto",
            width: "80%",
          }}
        />
        <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
          モヤモヤから抜け出す一歩に
        </Typography>
      </Box>

      {/* とは？ */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          📘 なやみノートとは？
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={5}
          sx={{ mt: 5 }}
          justifyContent="center"
        >
          {features.map(({ title, Icon, lines }, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mb: 1, fontWeight: 700, fontSize: "1.1rem" }}>{title}</Typography>
              <Icon sx={{ fontSize: 64, color: brick }} />
              <Typography sx={{ mt: 2, lineHeight: 1.8 }}>
                {lines[0]}
                <br />
                {lines[1]}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Typography sx={{ mt: 6, textAlign: "left", lineHeight: 2 }}>
          頭の中のモヤモヤと、やるべきことの間のギャップを埋める思考ツールです。まずはなやみを書き出して、一歩を踏み出してみませんか？
        </Typography>
      </Box>

      {/* CTA */}
      <Stack spacing={1} sx={{ mt: 5, mx: "auto", maxWidth: 400 }}>
        <Button
          component={NextLink}
          href="/signup"
          variant="contained"
          size="large"
          disableElevation
          sx={{ fontWeight: 600, py: 1.5 }}
        >
          初めての方はこちら
        </Button>
        <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
          登録して始めるほか、ゲストログインでも試せます
        </Typography>
      </Stack>

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Link
          href="https://github.com/reimurase/rails-next-nayami-note"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <GitHubIcon sx={{ fontSize: 20 }} />
          GitHub
        </Link>
      </Box>
    </Container>
  );
}
