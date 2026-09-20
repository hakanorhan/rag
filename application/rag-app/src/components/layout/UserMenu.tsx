"use client";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { login, logout } from "@/app/actions/auth";
import useMenuAnchor from "@/hooks/useMenuAnchor";
import { Link } from "@/i18n/navigation";

export default function UserMenu({
  isAuthenticated,
  userName,
}: {
  isAuthenticated: boolean;
  userName: string | null;
}) {
  const t = useTranslations("AppBar.userMenu");
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();

  return (
    <Box
      sx={{
        flexGrow: 0,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          display: { xs: "none", md: "block" },
          whiteSpace: "nowrap",
          color: "text.primary",
          fontWeight: isAuthenticated ? 500 : 700,
        }}
      >
        {isAuthenticated ? t("signedIn") : t("signedOut")}
      </Typography>
      <Tooltip title={isAuthenticated ? t("signedIn") : t("signedOut")}>
        <IconButton
          aria-label={isAuthenticated ? t("openUserMenu") : t("openLoginMenu")}
          onClick={openMenu}
          sx={{ p: 0 }}
        >
          <Badge
            overlap="circular"
            variant="dot"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: isAuthenticated ? "success.main" : "text.disabled",
                border: "2px solid",
                borderColor: "background.paper",
                width: 12,
                height: 12,
                borderRadius: "50%",
              },
            }}
          >
            <Avatar
              alt={t("avatarAlt")}
              sx={{ bgcolor: "background.paper", color: "text.primary" }}
            >
              <PersonRoundedIcon />
            </Avatar>
          </Badge>
        </IconButton>
      </Tooltip>
      <UserMenuContent
        anchorElement={anchorElement}
        isAuthenticated={isAuthenticated}
        onClose={closeMenu}
        open={isOpen}
        userName={userName}
      />
    </Box>
  );
}

type UserMenuContentProps = {
  anchorElement: HTMLElement | null;
  isAuthenticated: boolean;
  onClose: () => void;
  open: boolean;
  userName: string | null;
};

function UserMenuContent({
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
          <MenuItem
            component={Link}
            href="/profile"
            onClick={onClose}
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <Typography>{t("profile")}</Typography>
          </MenuItem>
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
