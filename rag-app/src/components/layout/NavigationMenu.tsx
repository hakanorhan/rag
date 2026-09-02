"use client";

import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import useMenuAnchor from "@/hooks/useMenuAnchor";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";

type NavigationPage = AppBarInterface["links"][keyof AppBarInterface["links"]];

export default function NavigationMenu({ pages }: { pages: NavigationPage[] }) {
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="Open navigation"
        aria-controls="navigation-menu"
        aria-haspopup="true"
        onClick={openMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="navigation-menu"
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={isOpen}
        onClose={closeMenu}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {pages.map((page) => (
          <MenuItem key={page.href} onClick={closeMenu}>
            <Typography
              component={Link}
              href={page.href.toLocaleLowerCase()}
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              {page.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
