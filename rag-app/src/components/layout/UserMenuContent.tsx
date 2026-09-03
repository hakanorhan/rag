"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { login, logout } from "@/lib/actions";

type UserMenuContentProps = {
  anchorElement: HTMLElement | null;
  isAuthenticated: boolean;
  onClose: () => void;
  open: boolean;
};

export default function UserMenuContent({
  anchorElement,
  isAuthenticated,
  onClose,
  open,
}: UserMenuContentProps) {
  return (
    <Menu
      disableScrollLock
      sx={{ mt: "45px" }}
      id="user-menu"
      anchorEl={anchorElement}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={onClose}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={onClose}>
            <Typography sx={{ textAlign: "center" }}>Account</Typography>
          </MenuItem>
          <MenuItem onClick={onClose}>
            <Typography sx={{ textAlign: "center" }}>Dashboard</Typography>
          </MenuItem>
          <form action={logout}>
            <MenuItem
              component="button"
              type="submit"
              onClick={onClose}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </form>
        </>
      ) : (
        <form action={login}>
          <MenuItem
            component="button"
            type="submit"
            onClick={onClose}
            sx={{ width: "100%" }}
          >
            <Typography sx={{ textAlign: "center" }}>Login</Typography>
          </MenuItem>
        </form>
      )}
    </Menu>
  );
}
