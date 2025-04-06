import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Drawer,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlineX,
  HiOutlineLightBulb,
  HiOutlineChat,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import Logo from "./Logo";

// Styled components remain the same...
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    border: "none",
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(1, 2),
  "&.active": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.text.secondary,
  fontSize: 20,
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

// Updated sidebar items with both seller and user order views
const sidebarItems = [
  {
    text: "Products",
    icon: <HiOutlineViewGrid size={20} />,
    path: "/products",
    tooltipText: "Manage Products",
    userType: "seller",
  },
  {
    text: "Orders",
    icon: <HiOutlineTruck size={20} />,
    path: "/orders",
    tooltipText: "Track Orders",
    userType: "seller",
  },
  {
    text: "My Orders",
    icon: <HiOutlineTruck size={20} />,
    path: "/my-orders",
    tooltipText: "My Orders",
    userType: "user",
  },
  {
    text: "Promotions",
    icon: <HiOutlineLightBulb size={20} />,
    path: "/promotion",
    tooltipText: "Promotions",
    userType: "seller",
  },
  {
    text: "Events",
    icon: <HiOutlineHome size={20} />,
    path: "/events",
    tooltipText: "Events",
    userType: "seller",
  },
  {
    text: "Messages",
    icon: <HiOutlineChat size={20} />,
    path: "/messages",
    tooltipText: "Messages",
    userType: "all",
  },
  {
    text: "Profile",
    icon: <HiOutlineUser size={20} />,
    path: "/profile",
    tooltipText: "User Profile",
    userType: "all", // Profile is visible to all users
  },
];

const Sidebar = ({ open, onClose, variant = "permanent" }) => {
  const theme = useTheme();
  const isTemporary = variant === "temporary";

  // Get userType from auth slice
  const userType = useSelector((state) => state.auth.userType);

  // Filter sidebar items based on user type
  const filteredSidebarItems = sidebarItems.filter(
    (item) => item.userType === "all" || item.userType === userType
  );

  const sidebarContent = (
    <>
      <LogoWrapper>
        <Logo />
        {isTemporary && (
          <IconButton onClick={onClose} size="small">
            <HiOutlineX />
          </IconButton>
        )}
      </LogoWrapper>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 100px)",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <List>
          {filteredSidebarItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={item.tooltipText} placement="right" arrow>
                <StyledListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={isTemporary ? onClose : undefined}
                >
                  <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  />
                </StyledListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  if (isTemporary) {
    return (
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {sidebarContent}
      </StyledDrawer>
    );
  }

  return (
    <StyledDrawer variant="permanent" open={open}>
      {sidebarContent}
    </StyledDrawer>
  );
};

export default Sidebar;
