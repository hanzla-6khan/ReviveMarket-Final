import { useDispatch, useSelector } from "react-redux";
import { clearMessages, resetPassword } from "./authSlice";
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
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import FormContainer from "../../ui/FormContainer";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const ResetPassword = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { isLoading, message, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    dispatch(resetPassword({ token, newPassword: data.password }));
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
          Reset Password
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Enter your new password below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
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
                margin="normal"
                fullWidth
                label="New Password"
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

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
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
              "Reset Password"
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

export default ResetPassword;
