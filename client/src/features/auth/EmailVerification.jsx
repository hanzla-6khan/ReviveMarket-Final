import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, verifyEmail } from "./authSlice";
import {
  Box,
  Typography,
  Alert,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import FormContainer from "../../ui/FormContainer";
import { useParams, Link, NavLink } from "react-router-dom";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

const EmailVerification = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { isLoading, message, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  return (
    <FormContainer>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        {isLoading ? (
          <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : message ? (
          <>
            <CheckCircleIcon
              sx={{ fontSize: 64, color: theme.palette.success.main, mb: 2 }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Email Verified!
            </Typography>
            <Alert
              severity="success"
              sx={{
                mt: 2,
                mb: 4,
                borderRadius: 1.5,
              }}
            >
              {message}
            </Alert>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Verifying Email
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  mb: 4,
                  borderRadius: 1.5,
                }}
              >
                {error}
              </Alert>
            )}
          </>
        )}

        <Box sx={{ mt: 3 }}>
          <Link
            component={NavLink}
            to="/login"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            Proceed to Login
          </Link>
        </Box>
      </Paper>
    </FormContainer>
  );
};

export default EmailVerification;
