"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { type ComponentType, type MouseEvent, useState } from "react";
import useMenuAnchor from "@/hooks/useMenuAnchor";

type UserMenuContentComponent = ComponentType<{
  anchorElement: HTMLElement | null;
  isAuthenticated: boolean;
  onClose: () => void;
  open: boolean;
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
}: {
  isAuthenticated: boolean;
}) {
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
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton
          aria-label={isAuthenticated ? "Open user menu" : "Open login menu"}
          onClick={handleOpen}
          sx={{ p: 0 }}
        >
          <Avatar alt="User" />
        </IconButton>
      </Tooltip>
      {UserMenuContent ? (
        <UserMenuContent
          anchorElement={anchorElement}
          isAuthenticated={isAuthenticated}
          onClose={closeMenu}
          open={isOpen}
        />
      ) : null}
    </Box>
  );
}
