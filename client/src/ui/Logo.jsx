import { Box, styled, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { Refresh as RefreshIcon } from "@mui/icons-material";

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "1.5rem",
  letterSpacing: "0.1em",
  fontFamily: "'Kanit', sans-serif",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.success.main,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "rotate(180deg)",
  },
}));

const DotSpan = styled("span")(({ theme }) => ({
  color: theme.palette.success.main,
  marginLeft: theme.spacing(0.5),
}));

const Logo = () => {
  const theme = useTheme();

  return (
    <LogoContainer component={Link} to="/">
      <IconWrapper>
        <RefreshIcon
          sx={{
            fontSize: "1.75rem",
            filter: `drop-shadow(0 2px 4px ${theme.palette.success.main}40)`,
          }}
        />
      </IconWrapper>
      <LogoText variant="h1" sx={{ fontSize: "1.5rem", m: 0 }}>
        Revive
        <DotSpan>Mkt</DotSpan>
      </LogoText>
    </LogoContainer>
  );
};

export default Logo;
