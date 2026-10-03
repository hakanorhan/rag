"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type ElementType, useState } from "react";
import { appBarHoverSx } from "@/app/theme";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";

type NavigationPage = AppBarInterface["links"][keyof AppBarInterface["links"]];

const Drawer = dynamic(() => import("@mui/material/Drawer"), { ssr: false });

export default function NavigationMenu({ pages }: { pages: NavigationPage[] }) {
  const t = useTranslations("AppBar.navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton
        size="large"
        aria-label={t("open")}
        aria-controls={isOpen ? "navigation-menu" : undefined}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        sx={{ color: "text.primary", ...appBarHoverSx }}
        onClick={() => {
          setHasOpened(true);
          setIsOpen(true);
        }}
      >
        <MenuIcon />
      </IconButton>
      {hasOpened && (
        <Drawer
          anchor="left"
          disableScrollLock
          open={isOpen}
          onClose={closeMenu}
          slotProps={{
            paper: {
              id: "navigation-menu",
              sx: { width: { xs: "100%", md: 500 } },
            },
          }}
        >
          <Box
            id="navigation-menu-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, sm: 4 },
              py: 2,
            }}
          >
            {t("title")}
            <IconButton
              aria-label={t("close")}
              onClick={closeMenu}
              color="inherit"
              sx={appBarHoverSx}
            >
              <CloseIcon
                fontSize="large"
                sx={{ stroke: "currentColor", strokeWidth: 1 }}
              />
            </IconButton>
          </Box>
          <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
            <List component="nav" aria-label={t("title")} disablePadding>
              {pages.map((page) => (
                <ListItemButton
                  key={page.href}
                  component={Link as ElementType}
                  href={page.href}
                  onClick={closeMenu}
                  sx={{
                    minHeight: 64,
                    fontSize: "2rem",
                    fontWeight: 700,
                    ...appBarHoverSx,
                  }}
                >
                  {page.title}
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
