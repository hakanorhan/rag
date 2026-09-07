"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";

type NavigationPage = AppBarInterface["links"][keyof AppBarInterface["links"]];

export default function NavigationMenu({ pages }: { pages: NavigationPage[] }) {
  const t = useTranslations("AppBar.navigation");
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isCompact) setIsOpen(false);
  }, [isCompact]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
      <IconButton
        size="large"
        aria-label={t("open")}
        aria-controls={isOpen ? "navigation-menu" : undefined}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        sx={{color: "black"}}
      >
        <MenuIcon />
      </IconButton>
      <Dialog
        fullScreen
        open={isOpen && isCompact}
        onClose={closeMenu}
        aria-labelledby="navigation-menu-title"
        slotProps={{ paper: { id: "navigation-menu" } }}
      >
        <DialogTitle
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
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
          <List component="nav" aria-label={t("title")} disablePadding>
            {pages.map((page) => (
              <ListItemButton
                key={page.href}
                component={Link}
                href={page.href}
                onClick={closeMenu}
                sx={{ minHeight: 64, fontSize: "1.25rem" }}
              >
                {page.title}
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
