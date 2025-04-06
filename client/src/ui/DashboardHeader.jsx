import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutButton from "./LogoutButton";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
}));

const LeftSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
});

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
});

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const theme = useTheme();

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LeftSection>
          <IconButton
            onClick={onMenuClick}
            edge="start"
            sx={{
              marginRight: 2,
              color: theme.palette.text.primary,
            }}
          >
            {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Dashboard
          </Typography>
        </LeftSection>

        <RightSection>
          <LogoutButton />
        </RightSection>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
