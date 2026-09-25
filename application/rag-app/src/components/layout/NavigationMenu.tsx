"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { useTranslations } from "next-intl";
import { type ElementType, useState } from "react";
import { hoverTheme } from "@/app/theme";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";

type NavigationPage = AppBarInterface["links"][keyof AppBarInterface["links"]];

export default function NavigationMenu({ pages }: { pages: NavigationPage[] }) {
  const t = useTranslations("AppBar.navigation");
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen(true)}
        sx={{ color: "text.primary", "&:hover": hoverTheme }}
      >
        <MenuIcon />
      </IconButton>
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
            sx={{ "&:hover": hoverTheme }}
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
                  "&:hover": hoverTheme,
                }}
              >
                {page.title}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
