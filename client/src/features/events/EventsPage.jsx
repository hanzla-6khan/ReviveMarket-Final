// src/pages/Events/index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../features/events/eventSlice";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
  Pagination,
  Stack,
  alpha,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import EventCard from "./EventCard";
import EventFilters from "./EventFilters";

const EventsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    sortBy: "date",
  });
  const [page, setPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // Filter events based on search and filters
  const filteredEvents = events?.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filters.category === "all" || event.category === filters.category;

    const matchesStatus =
      filters.status === "all" || event.status === filters.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort events
  const sortedEvents = [...(filteredEvents || [])].sort((a, b) => {
    switch (filters.sortBy) {
      case "date":
        return new Date(a.date) - new Date(b.date);
      case "capacity":
        return b.capacity - a.capacity;
      case "attendees":
        return b.attendees.length - a.attendees.length;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil((sortedEvents?.length || 0) / eventsPerPage);
  const paginatedEvents = sortedEvents?.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        pt: { xs: 4, md: 8 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Discover Events
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Find and join amazing events happening around you
          </Typography>
        </Box>

        {/* Search and Filters Section */}
        <Grid spacing={2} sx={{ mb: 6 }}>
          <Grid item xs={10} md={8} alignContent="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EventFilters filters={filters} setFilters={setFilters} />
          </Grid>
        </Grid>

        {/* Events Grid */}
        {isLoading ? (
          <Box>Loading...</Box>
        ) : sortedEvents?.length ? (
          <>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {paginatedEvents.map((event) => (
                <Grid item xs={12} sm={6} lg={4} key={event._id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Stack alignItems="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No events found matching your criteria.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;
