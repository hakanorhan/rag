/**
 * Material UI – Toggling color mode Component Documentation: https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
 * Based on the official Material UI Toggling color mode example, customized for project-specific requirements.
 */
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "@/i18n/navigation";
import type { AppBarInterface } from "../../../messages/interfaces";
import DarkLightMode from "./DarkLightMode";
import Localization from "./Localization";
import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";

type AppBarProps = {
  backgroundColor: string;
  isAuthenticated: boolean;
  links: AppBarInterface["links"];
};

export default function AppBar({
  backgroundColor,
  isAuthenticated,
  links,
}: AppBarProps) {
  const pages = [links.linkCar, links.linkAbout, links.linkContact];

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
            <NavigationMenu pages={pages} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: "flex",
                flexGrow: { xs: 1, md: 0 },
                fontFamily: "monospace",
                fontSize: { xs: "1.5rem", md: "1.25rem" },
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
            <UserMenu isAuthenticated={isAuthenticated} />
          </Toolbar>
        </Container>
      </MuiAppBar>
    </div>
  );
}
