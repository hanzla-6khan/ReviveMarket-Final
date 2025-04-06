import { useDispatch, useSelector } from "react-redux";
import { clearMessages, forgotPassword } from "./authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  InputAdornment,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import FormContainer from "../../ui/FormContainer";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const ForgotPassword = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email));
  };

  useEffect(() => {
    clearMessages();
  }, []);

  return (
    <FormContainer>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 480,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: "center",
            mb: 4,
          }}
        >
          Forgot Password
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Enter your email address and we'll send you instructions to reset your
          password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              borderRadius: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              "&:hover": {
                boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          {(message || error) && (
            <Alert
              severity={message ? "success" : "error"}
              sx={{
                mt: 2,
                borderRadius: 1.5,
              }}
            >
              {message || error}
            </Alert>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              component={NavLink}
              to="/login"
              sx={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontWeight: 600,
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </FormContainer>
  );
};

export default ForgotPassword;
