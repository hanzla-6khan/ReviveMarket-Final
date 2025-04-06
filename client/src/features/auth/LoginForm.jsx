import { useDispatch, useSelector } from "react-redux";
import { clearMessages, loginUser } from "../../features/auth/authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import FormContainer from "../../ui/FormContainer";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, userType, error } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "test@test.com",
      password: "123456",
    },
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (userType === "user") {
        navigate("/my-order");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate]);

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
          maxWidth: 450,
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
          Welcome Back
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Email Field */}
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

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password must be at least 3 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
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

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline-block", mr: 1 }}
            >
              Forgot password?
            </Typography>
            <Link
              component={NavLink}
              to="/forgot-password"
              variant="body2"
              sx={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontWeight: 500,
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Reset Now
            </Link>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
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
              "Sign In"
            )}
          </Button>

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 1.5,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Register Link */}
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline-block", mr: 1 }}
            >
              Don't have an account?
            </Typography>

            <Link
              component={NavLink}
              to="/register"
              sx={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontWeight: 500,
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Sign up now
            </Link>
          </Box>

          {/* Google Login Button */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLoginButton />
          </GoogleOAuthProvider>
        </Box>
      </Paper>
    </FormContainer>
  );
};

export default LoginForm;
