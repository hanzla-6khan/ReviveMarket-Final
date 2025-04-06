import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../features/events/eventSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  useTheme,
  Container,
  Paper,
  Fade,
  IconButton,
  Tooltip,
  CardActionArea,
  Skeleton,
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn,
  Group,
  AccessTime,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "planned":
        return {
          main: theme.palette.info.main,
          light: theme.palette.info.light,
        };
      case "ongoing":
        return {
          main: theme.palette.success.main,
          light: theme.palette.success.light,
        };
      case "completed":
        return {
          main: theme.palette.grey[500],
          light: theme.palette.grey[100],
        };
      case "cancelled":
        return {
          main: theme.palette.error.main,
          light: theme.palette.error.light,
        };
      default:
        return {
          main: theme.palette.grey[500],
          light: theme.palette.grey[100],
        };
    }
  };

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper + "90",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-12px)",
            boxShadow: `0 20px 40px ${theme.palette.primary.main}15`,
          },
        }}
      >
        <CardActionArea onClick={() => navigate(`/events/${event._id}`)}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              {/* Status and Category */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={event.category}
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    "& .MuiChip-label": { fontWeight: 600 },
                  }}
                />
                <Chip
                  label={
                    event.status.charAt(0).toUpperCase() + event.status.slice(1)
                  }
                  size="small"
                  sx={{
                    borderRadius: 3,
                    bgcolor: getStatusColor(event.status).light,
                    color: getStatusColor(event.status).main,
                    "& .MuiChip-label": { fontWeight: 600 },
                  }}
                />
              </Stack>

              {/* Title */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.3,
                }}
              >
                {event.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.6,
                }}
              >
                {event.description}
              </Typography>

              {/* Event Details */}
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.date).toLocaleDateString()} at{" "}
                    {new Date(event.date).toLocaleTimeString()}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOn
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Group
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {event.capacity === 0
                      ? "Unlimited spots"
                      : `${event.attendees.length}/${event.capacity} spots filled`}
                  </Typography>
                </Stack>
              </Stack>

              {/* Upcoming Badge */}
              {isUpcoming && (
                <Tooltip title="Upcoming Event" arrow>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "background.paper",
                      boxShadow: theme.shadows[2],
                      "&:hover": {
                        bgcolor: "background.paper",
                      },
                    }}
                  >
                    <ScheduleIcon color="primary" sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Fade>
  );
};

const EventSection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { events, isLoading } = useSelector((state) => state.events);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton
                  variant="rounded"
                  height={400}
                  sx={{
                    borderRadius: 4,
                    transform: "scale(0.98)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        py: 10,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(180deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ mb: 8 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1,
              px: 3,
              borderRadius: 8,
              bgcolor: theme.palette.primary.main + "10",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <StarIcon
              sx={{ color: theme.palette.primary.main, fontSize: 20 }}
            />
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Upcoming Events
            </Typography>
          </Paper>

          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              position: "relative",
              mb: 3,
            }}
          >
            Featured Events
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            Join exciting events and connect with your community
          </Typography>
        </Stack>

        {!events || events.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: theme.palette.background.paper + "80",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h6" align="center" color="text.secondary">
              No events available at the moment.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {events.slice(0, displayCount).map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} index={index} />
              </Grid>
            ))}
          </Grid>
        )}

        {events.length > displayCount && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                px: 4,
                borderRadius: 8,
                bgcolor: theme.palette.primary.main + "10",
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => setDisplayCount((prev) => prev + 6)}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Load More Events
              </Typography>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventSection;
