"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { login, logout } from "@/lib/actions";

type UserMenuContentProps = {
  anchorElement: HTMLElement | null;
  isAuthenticated: boolean;
  onClose: () => void;
  open: boolean;
  userName: string | null;
};

export default function UserMenuContent({
  anchorElement,
  isAuthenticated,
  onClose,
  open,
  userName,
}: UserMenuContentProps) {
  const t = useTranslations("AppBar.userMenu");
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
          {userName ? (
            <MenuItem disabled>
              <Typography>{t("signedInAs", { name: userName })}</Typography>
            </MenuItem>
          ) : null}
          <form action={logout}>
            <MenuItem
              component="button"
              type="submit"
              onClick={onClose}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ textAlign: "center" }}>
                {t("logout")}
              </Typography>
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
            <Typography sx={{ textAlign: "center" }}>{t("login")}</Typography>
          </MenuItem>
        </form>
      )}
    </Menu>
  );
}
