"use client";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { type ComponentType, type MouseEvent, useState } from "react";
import useMenuAnchor from "@/hooks/useMenuAnchor";

type UserMenuContentComponent = ComponentType<{
  anchorElement: HTMLElement | null;
  isAuthenticated: boolean;
  onClose: () => void;
  open: boolean;
  userName: string | null;
}>;

let userMenuContentPromise:
  | Promise<typeof import("./UserMenuContent")>
  | undefined;

function importUserMenuContent() {
  userMenuContentPromise ??= import("./UserMenuContent");
  return userMenuContentPromise;
}

export default function UserMenu({
  isAuthenticated,
  userName,
}: {
  isAuthenticated: boolean;
  userName: string | null;
}) {
  const t = useTranslations("AppBar.userMenu");
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();
  const [UserMenuContent, setUserMenuContent] =
    useState<UserMenuContentComponent | null>(null);

  async function handleOpen(event: MouseEvent<HTMLElement>) {
    openMenu(event);

    if (UserMenuContent) return;

    try {
      const module = await importUserMenuContent();
      setUserMenuContent(() => module.default);
    } catch (error) {
      closeMenu();
      console.error("Benutzermenü konnte nicht geladen werden.", error);
    }
  }

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
        sx={{ display: { xs: "none", sm: "block" }, whiteSpace: "nowrap" }}
      >
        {isAuthenticated ? t("signedIn") : t("signedOut")}
      </Typography>
      <Tooltip title={isAuthenticated ? t("signedIn") : t("signedOut")}>
        <IconButton
          aria-label={isAuthenticated ? "Open user menu" : "Open login menu"}
          onClick={handleOpen}
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
            <Avatar alt="User" />
          </Badge>
        </IconButton>
      </Tooltip>
      {UserMenuContent ? (
        <UserMenuContent
          anchorElement={anchorElement}
          isAuthenticated={isAuthenticated}
          onClose={closeMenu}
          open={isOpen}
          userName={userName}
        />
      ) : null}
    </Box>
  );
}
