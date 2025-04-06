import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "./authSlice";
import { Box, Button, useTheme } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    dispatch(loginWithGoogle(token));
  };

  const handleGoogleFailure = () => {
    console.log("Google Sign In was unsuccessful. Try again later.");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: theme.palette.divider,
        },
        mt: 2,
        mb: 5,
      }}
    >
      <Box
        sx={{
          px: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          position: "relative",
          fontSize: "0.875rem",
        }}
      >
        OR
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          mt: 1,
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          text="signin_with"
          theme="outline"
          size="large"
          width="100%"
          render={({ onClick }) => (
            <Button
              onClick={onClick}
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.divider,
                },
                boxShadow: `0 2px 8px ${theme.palette.text.disabled}40`,
              }}
            >
              Continue with Google
            </Button>
          )}
        />
      </Box>
    </Box>
  );
};

export default GoogleLoginButton;
