import { Box, useTheme, useMediaQuery, styled } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./DashboardHeader";
import { Outlet } from "react-router-dom";

// Styled components with responsive design
const StyleAppLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const Main = styled(Box)(({ theme, isSidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isSidebarOpen ? theme.spacing(0) : 0,
}));

const Content = styled(Box)(({ theme }) => ({
  minHeight: `calc(100vh - ${theme.spacing(8)})`,
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  overflow: "auto",
  backgroundColor: theme.palette.grey[100],
}));

const Container = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  height: "100%",
}));

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <StyleAppLayout>
      <Sidebar
        open={isSidebarOpen}
        onClose={toggleSidebar}
        variant={isMobile ? "temporary" : "permanent"}
      />
      <Main isSidebarOpen={isSidebarOpen} component="main">
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <Content>
          <Container>
            <Outlet />
          </Container>
        </Content>
      </Main>
    </StyleAppLayout>
  );
};

export default DashboardLayout;
