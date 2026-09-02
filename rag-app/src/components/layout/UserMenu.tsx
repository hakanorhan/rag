"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMenuAnchor from "@/hooks/useMenuAnchor";
import { login, logout } from "@/lib/actions";

export default function UserMenu({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton
          aria-label={isAuthenticated ? "Open user menu" : "Open login menu"}
          onClick={openMenu}
          sx={{ p: 0 }}
        >
          <Avatar alt="User" />
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock
        sx={{ mt: "45px" }}
        id="user-menu"
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isOpen}
        onClose={closeMenu}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={closeMenu}>
              <Typography sx={{ textAlign: "center" }}>Account</Typography>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
              <Typography sx={{ textAlign: "center" }}>Dashboard</Typography>
            </MenuItem>
            <form action={logout}>
              <MenuItem
                component="button"
                type="submit"
                onClick={closeMenu}
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
              onClick={closeMenu}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ textAlign: "center" }}>Login</Typography>
            </MenuItem>
          </form>
        )}
      </Menu>
    </Box>
  );
}
