"use client";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import useMenuAnchor from "@/hooks/useMenuAnchor";
import UserMenuContent from "./UserMenuContent";

export default function UserMenu({
  isAuthenticated,
  userName,
}: {
  isAuthenticated: boolean;
  userName: string | null;
}) {
  const t = useTranslations("AppBar.userMenu");
  const { anchorElement, closeMenu, isOpen, openMenu } = useMenuAnchor();

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
        sx={{ display: { xs: "none", md: "block" }, whiteSpace: "nowrap" }}
      >
        {isAuthenticated ? t("signedIn") : t("signedOut")}
      </Typography>
      <Tooltip title={isAuthenticated ? t("signedIn") : t("signedOut")}>
        <IconButton
          aria-label={isAuthenticated ? "Open user menu" : "Open login menu"}
          onClick={openMenu}
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
      <UserMenuContent
        anchorElement={anchorElement}
        isAuthenticated={isAuthenticated}
        onClose={closeMenu}
        open={isOpen}
        userName={userName}
      />
    </Box>
  );
}
