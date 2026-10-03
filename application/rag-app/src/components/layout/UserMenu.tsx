"use client";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { logout } from "@/app/actions/auth";
import { appBarHoverSx } from "@/app/theme";
import useMenuAnchor from "@/hooks/useMenuAnchor";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session);
  const userName = session?.user.name || session?.user.email || null;
  const t = useTranslations("AppBar.userMenu");
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();

  const handleLogin = () => {
    const returnTo = window.location.pathname + window.location.search;
    const params = new URLSearchParams({ returnTo });

    window.location.assign(`/api/login?${params}`);
  };

  return (
    <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        aria-label={isAuthenticated ? t("openUserMenu") : t("login")}
        aria-controls={isAuthenticated && isOpen ? "user-menu" : undefined}
        aria-haspopup={isAuthenticated ? "true" : undefined}
        aria-expanded={isAuthenticated ? isOpen : undefined}
        onClick={(event) => {
          if (isAuthenticated) {
            openMenu(event);
          } else {
            handleLogin();
          }
        }}
        sx={{
          px: 0.5,
          py: 0.5,
          borderRadius: 1,
          gap: 0.75,
          color: "text.primary",
          ...appBarHoverSx,
          "&.Mui-focusVisible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: { xs: "none", md: "block" },
            whiteSpace: "nowrap",
            minWidth: 76,
            textAlign: "right",
            color: "inherit",
            fontWeight: isAuthenticated ? 500 : 700,
          }}
        >
          {isAuthenticated ? t("signedIn") : t("signedOut")}
        </Typography>
        {isAuthenticated ? <LogoutOutlinedIcon /> : <LoginOutlinedIcon />}
      </IconButton>
      {isAuthenticated ? (
        <UserMenuContent
          anchorElement={anchorElement}
          onClose={closeMenu}
          open={isOpen}
          userName={userName}
        />
      ) : null}
    </Box>
  );
}

type UserMenuContentProps = {
  anchorElement: HTMLElement | null;
  onClose: () => void;
  open: boolean;
  userName: string | null;
};

function UserMenuContent({
  anchorElement,
  onClose,
  open,
  userName,
}: UserMenuContentProps) {
  const t = useTranslations("AppBar.userMenu");

  const handleLogout = async () => {
    onClose();
    sessionStorage.removeItem("rag-chat-history");
    await logout();
  };

  return (
    <Menu
      id="user-menu"
      anchorEl={anchorElement}
      open={open}
      onClose={onClose}
      disableScrollLock
      keepMounted
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 248,
            borderRadius: 2.5,
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.18)",
            overflow: "hidden",
          },
        },
        list: {
          "aria-labelledby": undefined,
          sx: { p: 1 },
        },
      }}
    >
      {userName ? (
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5, overflowWrap: "anywhere" }}
          >
            {t("signedInAs", { name: userName })}
          </Typography>
        </Box>
      ) : null}
      {userName ? <Divider sx={{ my: 0.75 }} /> : null}
      <MenuItem
        component={Link}
        href="/profile"
        onClick={onClose}
        sx={{
          color: "inherit",
          textDecoration: "none",
          minHeight: 44,
          px: 1.5,
          borderRadius: 1.5,
          gap: 0.5,
          "&:hover": { color: "primary.main" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
          <AccountCircleOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          {t("profile")}
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          minHeight: 44,
          px: 1.5,
          borderRadius: 1.5,
          gap: 0.5,
        }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
          <LogoutOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          {t("logout")}
        </Typography>
      </MenuItem>
    </Menu>
  );
}
