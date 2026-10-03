"use client";

/**
 * Material UI – Toggling color mode Component Documentation: https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
 * Based on the official Material UI Toggling color mode example, customized for project-specific requirements.
 */
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { appBarHoverSx } from "@/app/theme";
import { Link } from "@/i18n/navigation";
import { COMPANY_NAME } from "@/lib/branding";
import type { AppBarInterface } from "../../../messages/interfaces";
import Localization from "./Localization";
import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";
import useNavigationRoles from "./useNavigationRoles";

type AppBarProps = {
  links: AppBarInterface["links"];
};

export default function AppBar(props: AppBarProps) {
  const { links } = props;
  const { isAdmin, isUser } = useNavigationRoles();
  const pages = [
    links.linkFleet,
    links.linkAbout,
    links.linkContact,
    ...(isUser ? [links.linkReservations] : []),
    ...(isAdmin ? [links.linkAdmin, links.linkAiProvider] : []),
  ];

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        height: "70px",
      }}
    >
      <MuiAppBar
        position="absolute"
        color="transparent"
        elevation={0}
        sx={{
          left: "50%",
          right: "auto",
          width: "100%",
          maxWidth: 2400,
          transform: "translateX(-50%)",
          color: "text.primary",
        }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: 2400, mx: "auto", width: "100%" }}
        >
          <Toolbar disableGutters>
            <NavigationMenu pages={pages} />
            <HomeLink />
            <Box sx={{ flexGrow: 1 }} />
            <Localization />
            <UserMenu />
          </Toolbar>
        </Container>
      </MuiAppBar>
    </Box>
  );
}

function HomeLink() {
  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <Typography
        component="span"
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: "flex",
          flexGrow: { xs: 1, lg: 0 },
          fontSize: { xs: "1.5rem" },
          fontWeight: 100,
          color: "text.primary",
          textDecoration: "none",
          ...appBarHoverSx,
        }}
      >
        {COMPANY_NAME}
      </Typography>
    </Link>
  );
}
