import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  TablePagination,
  Tooltip,
  Button,
  Card,
  Divider,
  useTheme,
  alpha,
  Stack,
  Chip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Event as EventIcon,
} from "@mui/icons-material";

import { createNewEvent, updateUserEvent, getUserEvents } from "./eventSlice";
import EventForm from "./EventForm";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: "0.875rem",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    fontSize: "0.75rem",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  transition: "background-color 0.2s",
}));

// EventForm Component

// Mobile Event Card Component
const MobileEventCard = ({ event, onEdit }) => {
  const theme = useTheme();
  const getStatusColor = event.status;

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          {event.title}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Chip
            label={event.category}
            color="primary"
            size="small"
            sx={{ borderRadius: 3 }}
          />
          <Chip
            label={event.status}
            color={getStatusColor}
            size="small"
            sx={{ borderRadius: 3 }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography variant="body2">
            <strong>Capacity:</strong>{" "}
            {event.capacity === 0
              ? "Unlimited"
              : `${event.attendees.length}/${event.capacity}`}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(event)}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

// Main EventList Component
const EventList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { events, userEvents, isLoading, error } = useSelector(
    (state) => state.events
  );

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    dispatch(getUserEvents());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingEvent) {
        await dispatch(
          updateUserEvent({
            eventId: editingEvent._id,
            eventData: data,
          })
        );
      } else {
        await dispatch(createNewEvent({ eventData: data }));
      }
      await dispatch(getUserEvents());
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planned":
        return "info"; // Blue
      case "ongoing":
        return "success"; // Green
      case "completed":
        return "default"; // Grey
      case "cancelled":
        return "error"; // Red
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={4}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <EventIcon
              sx={{
                fontSize: { xs: 32, sm: 40 },
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                padding: 1,
                borderRadius: 2,
              }}
            />
            <Stack spacing={0.5}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                }}
              >
                Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your events
              </Typography>
            </Stack>
          </Stack>
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              backgroundColor: theme.palette.success.main,
              "&:hover": {
                backgroundColor: theme.palette.success.dark,
                transform: "translateY(-1px)",
              },
              borderRadius: 3,
              textTransform: "none",
              px: { xs: 2, sm: 4 },
              py: 1.5,
              transition: "all 0.2s",
              boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
            }}
          >
            Create Event
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Events List */}
        {!isLoading && !error && userEvents?.length > 0 && (
          <StyledCard>
            {isMobile ? (
              // Mobile View
              <Box sx={{ p: 2 }}>
                {userEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <MobileEventCard
                      key={event._id}
                      event={event}
                      onEdit={handleEdit}
                    />
                  ))}
              </Box>
            ) : (
              // Desktop View
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Title</HeaderCell>
                      <HeaderCell>Category</HeaderCell>
                      <HeaderCell>Date & Time</HeaderCell>
                      <HeaderCell>Location</HeaderCell>
                      <HeaderCell align="center">Capacity</HeaderCell>
                      <HeaderCell align="center">Status</HeaderCell>
                      <HeaderCell align="center">Actions</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userEvents
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((event) => (
                        <StyledTableRow key={event._id}>
                          <TableCell>
                            <Typography fontWeight={500}>
                              {event.title}
                            </Typography>
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
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={event.category}
                              color="primary"
                              size="small"
                              sx={{ borderRadius: 3 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.date).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell align="center">
                            {event.capacity === 0
                              ? "Unlimited"
                              : `${event.attendees.length}/${event.capacity}`}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={event.status}
                              color={getStatusColor(event.status)}
                              size="small"
                              sx={{ borderRadius: 3 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(event)}
                                sx={{
                                  color: theme.palette.primary.main,
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Divider />
            <Box sx={{ py: 2, px: 2 }}>
              <TablePagination
                component="div"
                count={userEvents.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </StyledCard>
        )}

        {/* Event Form Dialog */}
        <EventForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingEvent}
        />

        {/* Empty State */}
        {!isLoading && !error && (!userEvents || userEvents.length === 0) && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              gap: 2,
            }}
          >
            <EventIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              No events found
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              Create your first event
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default EventList;
