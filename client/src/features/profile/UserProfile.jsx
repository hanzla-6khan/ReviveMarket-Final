import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  updateUser,
  updatePassword,
  deleteAccount,
} from "./userSlice";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  useTheme,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import {
  Camera as CameraIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Public as GlobeIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  HiCamera,
  HiOutlineGlobe,
  HiOutlineIdentification,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/authSlice";

const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading, error, message } = useSelector(
    (state) => state.user
  );
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    await dispatch(updateUser({ id: userData._id, userData: data }));
    setIsEditing(false);
  };

  const onPasswordSubmit = async (data) => {
    await dispatch(updatePassword(data.password));
    setOpenPasswordDialog(false);
    resetPassword();
  };

  const handleDeleteAccount = async () => {
    await dispatch(deleteAccount(userData._id)).then(() => {
      dispatch(logout());
    });
    setOpenDeleteDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Header Section */}
      <Box sx={{ position: "relative", height: "200px", mb: 8 }}>
        <Box
          sx={{
            height: "100%",
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        />

        {/* Profile Image */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <Avatar
            src={userData?.profileImage}
            sx={{
              width: 120,
              height: 120,
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[3],
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
              "&:hover": { backgroundColor: theme.palette.grey[100] },
            }}
          >
            <HiCamera />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Content */}
      <Grid container spacing={3}>
        {/* Left Column - User Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  startIcon={isEditing ? <CheckIcon /> : <EditIcon />}
                  onClick={() =>
                    isEditing ? handleSubmit(onSubmit)() : setIsEditing(true)
                  }
                  variant={isEditing ? "contained" : "outlined"}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...register("name", { required: "Name is required" })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <HiOutlineUser sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  {/* Add other form fields similar to the TextField above */}
                  {/* Email, Phone, Gender, Address, Country */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      {...register("email", { required: "Email is required" })}
                      disabled={!isEditing}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <HiOutlineMail style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                      disabled={!isEditing}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <HiOutlinePhone style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Controller
                        name="gender"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="gender-label"
                            label="Gender"
                            disabled={!isEditing}
                            startAdornment={
                              <HiOutlineIdentification
                                style={{ marginRight: 8 }}
                              />
                            }
                          >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      disabled={!isEditing}
                      variant="outlined"
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: (
                          <HiOutlineLocationMarker style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      {...register("country", {
                        required: "Country is required",
                      })}
                      disabled={!isEditing}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <HiOutlineGlobe style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Account Status */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account Status
                </Typography>
                <Stack spacing={2}>
                  <Chip
                    label={userData?.verified ? "Verified" : "Unverified"}
                    color={userData?.verified ? "success" : "warning"}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Account created on{" "}
                    {new Date(userData?.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Security
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              {...registerPassword("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!passwordErrors.password}
              helperText={passwordErrors.password?.message}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileDashboard;
