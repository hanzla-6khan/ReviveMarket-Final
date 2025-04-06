import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  alpha,
  styled,
  keyframes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.light, 0.1)} 0%, 
    ${alpha(theme.palette.background.default, 0.95)} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: `radial-gradient(circle at 50% 50%, 
      ${alpha(theme.palette.primary.main, 0.1)} 0%, 
      transparent 50%)`,
    zIndex: 0,
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: `${float} 3s ease-in-out infinite`,
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: "8rem",
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(2),
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const HomeButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(1.5, 4),
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: 600,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
  "&:hover": {
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <StyledContainer maxWidth="xl">
      <ContentBox>
        <IconWrapper>
          <SearchOffRoundedIcon
            sx={{
              fontSize: 100,
              color: theme.palette.primary.main,
              opacity: 0.8,
            }}
          />
        </IconWrapper>

        <ErrorCode variant="h1">404</ErrorCode>

        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            maxWidth: 500,
            mx: "auto",
            color: theme.palette.text.secondary,
          }}
        >
          Oops! The page you're looking for seems to have wandered off. Don't
          worry though, you can always head back home and start fresh.
        </Typography>

        <HomeButton
          variant="contained"
          startIcon={<HomeRoundedIcon />}
          onClick={() => navigate("/")}
        >
          Back to Home
        </HomeButton>
      </ContentBox>
    </StyledContainer>
  );
};

export default NotFoundPage;
