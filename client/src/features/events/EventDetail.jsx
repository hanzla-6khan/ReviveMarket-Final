import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventById, joinUserEvent } from "../../features/events/eventSlice";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  Divider,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  AvatarGroup,
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn,
  AccessTime,
  Group,
  Link as LinkIcon,
  CalendarToday,
} from "@mui/icons-material";

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { event, isLoading, error, successMessage } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
    }
  }, [dispatch, id]);

  const handleJoinEvent = async () => {
    try {
      await dispatch(joinUserEvent(id)).unwrap();
      dispatch(getEventById(id));
    } catch (error) {
      console.error("Failed to join event:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "90vh",
        py: { xs: 2, md: 2 },
        backgroundImage: "linear-gradient(to bottom, #f3f4f6, #ffffff)",
      }}
    >
      <Container maxWidth="lg">
        {/* Alert Messages */}
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                boxShadow: theme.shadows[2],
              }}
            >
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert
              severity="success"
              sx={{
                borderRadius: 2,
                boxShadow: theme.shadows[2],
              }}
            >
              {successMessage}
            </Alert>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: "#ffffff",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Category Badge */}
              <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                <Chip
                  label={event?.category}
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    px: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>

              {/* Header */}
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 2,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  {event?.title}
                </Typography>

                {/* Organizer Info */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    src={event?.organizer?.avatar}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Organized by
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {event?.organizer?.name}
                    </Typography>
                  </Box>
                </Stack>

                {/* Event Details */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: theme.palette.text.secondary,
                      mb: 4,
                    }}
                  >
                    {event?.description}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.6),
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CalendarToday color="primary" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Date & Time
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {new Date(event?.date).toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.6),
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <LocationOn color="primary" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {event?.location}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleJoinEvent}
                    sx={{
                      borderRadius: 2,
                      minWidth: 200,
                      py: 1.5,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    Join Event
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Attendees Card */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "#ffffff",
                }}
              >
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Attendees
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event?.capacity === 0
                        ? "Unlimited spots available"
                        : `${event?.attendees?.length || 0}/${
                            event?.capacity
                          } spots filled`}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Meet Link Card (if available) */}
              {event?.meetLink && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Meeting Link
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      wordBreak: "break-all",
                    }}
                  >
                    <LinkIcon color="primary" />
                    <Typography variant="body2">{event?.meetLink}</Typography>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetail;
