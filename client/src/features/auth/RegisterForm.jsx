import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { clearMessages, registerUser } from "./authSlice";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  Paper,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  AccountCircle as UsernameIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import FormContainer from "../../ui/FormContainer";

const RegisterForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "John Doe",
      username: "johndoe",
      email: "user1@test.com",
      password: "Jhon@123",
    },
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
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
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* Full Name Field */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon
                          sx={{ color: theme.palette.text.secondary }}
                        />
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

            {/* Username Field */}
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UsernameIcon
                          sx={{ color: theme.palette.text.secondary }}
                        />
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
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon
                          sx={{ color: theme.palette.text.secondary }}
                        />
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
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
                  message:
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{ color: theme.palette.text.secondary }}
                        />
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

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
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
                "Create Account"
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Success Message */}
            {message && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 1.5,
                }}
              >
                {message}
              </Alert>
            )}

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: "inline-block", mr: 1 }}
              >
                Already have an account?
              </Typography>
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
                Sign in
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </FormContainer>
  );
};

export default RegisterForm;
