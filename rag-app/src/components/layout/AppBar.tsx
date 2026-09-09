/**
 * Material UI – Toggling color mode Component Documentation: https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
 * Based on the official Material UI Toggling color mode example, customized for project-specific requirements.
 */
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";
import BrandLink from "./BrandLink";
import DarkLightMode from "./DarkLightMode";
import Localization from "./Localization";
import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";

type AppBarProps = {
  isAdmin: boolean;
  isAuthenticated: boolean;
  isUser: boolean;
  links: AppBarInterface["links"];
  userName: string | null;
};

export default function AppBar(props: AppBarProps) {
  const { isAdmin, isAuthenticated, isUser, links, userName } = props;
  const pages = [
    links.linkFleet,
    links.linkAbout,
    links.linkContact,
    ...(isAuthenticated && isUser ? [links.linkReservations] : []),
    ...(isAuthenticated && isAdmin ? [links.linkAdmin] : []),
  ];

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        height: "80px",
      }}
    >
      <MuiAppBar position="static" color="default" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <NavigationMenu pages={pages} />
            <Suspense fallback={null}>
              <BrandLink />
            </Suspense>
            {/* Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }}>
              {pages.map((page) => (
                <Link
                  href={page.href}
                  key={page.href}
                  style={{ marginRight: "1rem" }}
                >
                  <Typography component="span" color="text.primary">
                    {page.title}
                  </Typography>
                </Link>
              ))}
            </Box>
            <div style={{ marginRight: "3rem" }}>
              <DarkLightMode />
            </div>
            <Localization />
            <UserMenu isAuthenticated={isAuthenticated} userName={userName} />
          </Toolbar>
        </Container>
      </MuiAppBar>
    </Box>
  );
}
