"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Action = {
  label: string;
  onClick: () => Promise<void> | void;
  color?: string;
};

type Props = {
  actions: Action[];
  disabled?: boolean;
};

const ActionMenu = ({ actions, disabled = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = async (action: Action) => {
    await action.onClick();
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="操作メニュー" onClick={handleOpen} disabled={disabled} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => handleClick(action)}
            disabled={disabled}
            sx={action.color ? { color: action.color } : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
