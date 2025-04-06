import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  styled,
  useTheme,
  Container,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";
import CartButton from "../features/cart/CartButton";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
  backdropFilter: "blur(8px)",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  textTransform: "none",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: theme.shape.borderRadius,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(0.5),
  },
}));

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 64,
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Logo Section */}

          <Logo />

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Events" arrow>
              <NavButton
                component={Link}
                to="/events-page"
                active={isActiveRoute("/events-page")}
              >
                Events
              </NavButton>
            </Tooltip>
            {!isAuthenticated ? (
              <>
                <NavButton
                  component={Link}
                  to="/login"
                  active={isActiveRoute("/login")}
                  startIcon={<PersonIcon />}
                >
                  Sign in
                </NavButton>
                <NavButton
                  component={Link}
                  to="/register"
                  active={isActiveRoute("/register")}
                  startIcon={<PersonAddIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  Sign up
                </NavButton>
              </>
            ) : (
              <>
                <Tooltip title="Dashboard" arrow>
                  <NavButton
                    component={Link}
                    to={userType === "user" ? "/my-orders" : "/dashboard"}
                    active={isActiveRoute("/dashboard")}
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </NavButton>
                </Tooltip>
                <Box sx={{ mx: 1 }}>
                  <LogoutButton />
                </Box>
              </>
            )}
            <Box
              sx={{
                ml: 1,
                borderLeft: `1px solid ${theme.palette.divider}`,
                pl: 1,
              }}
            >
              <CartButton />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
