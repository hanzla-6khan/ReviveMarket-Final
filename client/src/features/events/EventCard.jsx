// src/pages/Events/EventCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Box,
  Button,
} from "@mui/material";
import {
  AccessTime,
  LocationOn,
  Group,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
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
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Header with Category and Status */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={event.category}
              color="primary"
              size="small"
              sx={{ borderRadius: 2 }}
            />
            <Chip
              label={
                event.status.charAt(0).toUpperCase() + event.status.slice(1)
              }
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: getStatusColor(event.status).light,
                color: getStatusColor(event.status).main,
              }}
            />
          </Stack>

          {/* Title */}
          <Typography variant="h6" fontWeight={700}>
            {event.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </Typography>

          {/* Event Details */}
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {new Date(event.date).toLocaleDateString()} at{" "}
                {new Date(event.date).toLocaleTimeString()}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Group fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {event.capacity === 0
                  ? "Unlimited spots"
                  : `${event.attendees.length}/${event.capacity} spots filled`}
              </Typography>
            </Stack>
          </Stack>

          {/* View Details Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/events/${event._id}`)}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            View Details
          </Button>
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
              }}
            >
              <ScheduleIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
