import { Box, Paper, Typography, useTheme, alpha, styled } from "@mui/material";

const StyledFormWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "0 1rem",
}));

const StyledFormPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5),
  },
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(10px)",
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 12px 48px ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  color: theme.palette.text.primary,
  textAlign: "center",
  fontWeight: 600,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "48px",
    height: "3px",
    borderRadius: "2px",
    backgroundColor: theme.palette.primary.main,
  },
}));

const FormContent = styled(Box)(({ theme }) => ({
  width: "100%",
  "& > *:not(:last-child)": {
    marginBottom: theme.spacing(3),
  },
}));

const FormContainer = ({ children, title }) => {
  const theme = useTheme();

  return (
    <StyledFormWrapper>
      <StyledFormPaper elevation={0}>
        {title && (
          <FormTitle variant="h4" component="h1">
            {title}
          </FormTitle>
        )}
        <FormContent>{children}</FormContent>
      </StyledFormPaper>
    </StyledFormWrapper>
  );
};

export default FormContainer;
