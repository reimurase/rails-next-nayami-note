"use client";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ConcernForm from "./ConcernForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const ConcernCreateDialog = ({ isOpen, onClose, onCreated }: Props) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        なやみを追加
        <IconButton onClick={onClose} aria-label="閉じる">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* 子要素が親の境界を超えても描画されるように設定 */}
      <DialogContent sx={{ overflow: "visible" }}>
        <ConcernForm onCreated={onCreated} />
      </DialogContent>
    </Dialog>
  );
};

export default ConcernCreateDialog;
