/**
 * Material UI – Toggling color mode Component Documentation: https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
 * Based on the official Material UI Toggling color mode example, customized for project-specific requirements.
 */
"use client";

import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { type MouseEvent, useState } from "react";
import { Link } from "@/i18n/navigation";
import { login, logout } from "@/lib/actions";
import type { AppBarInterface } from "../../../messages/interfaces";
import DarkLightMode from "./DarkLightMode";
import Localization from "./Localization";

type AppBarProps = {
  backgroundColor: string;
  isAuthenticated: boolean;
};

export default function AppBar({
  backgroundColor,
  isAuthenticated,
}: AppBarProps) {
  const translation = useTranslations("AppBar");
  const linksMessages: AppBarInterface = {
    links: translation.raw("links"),
  };

  const pages = [
    linksMessages.links.linkCar,
    linksMessages.links.linkAbout,
    linksMessages.links.linkContact,
  ];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        backgroundColor: backgroundColor,
        height: "80px",
      }}
    >
      <MuiAppBar position="static" sx={{ backgroundColor }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              RAG
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              RAG
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  href={page.href.toLocaleLowerCase()}
                  key={page.href}
                  style={{ marginRight: "1rem" }}
                >
                  {page.title}
                </Link>
              ))}
            </Box>
            <div style={{ marginRight: "3rem" }}>
              <DarkLightMode />
            </div>
            <Localization />
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  aria-label={
                    isAuthenticated ? "Open user menu" : "Open login menu"
                  }
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar alt="Remy Sharp" />
                </IconButton>
              </Tooltip>
              <Menu
                disableScrollLock
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        Account
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        Dashboard
                      </Typography>
                    </MenuItem>
                    <form action={logout}>
                      <MenuItem
                        component="button"
                        type="submit"
                        onClick={handleCloseUserMenu}
                        sx={{ width: "100%" }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          Logout
                        </Typography>
                      </MenuItem>
                    </form>
                  </>
                ) : (
                  <form action={login}>
                    <MenuItem
                      component="button"
                      type="submit"
                      onClick={handleCloseUserMenu}
                      sx={{ width: "100%" }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        Login
                      </Typography>
                    </MenuItem>
                  </form>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </div>
  );
}
