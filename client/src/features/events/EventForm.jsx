import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, Stack } from "@mui/material"; // Added Stack and Dialog
import {
  Button,
  useMediaQuery,
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

// Replace the DateTimePicker with a simple datetime-local input to avoid the error
const EventForm = ({ open, onClose, onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 16), // Format for datetime-local input
      location: "",
      capacity: 0,
      category: "Other",
      meetLink: "",
      status: "planned",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        date: new Date(initialData.date).toISOString().slice(0, 16),
      });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Event" : "Create New Event"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />

            {/* Replace DateTimePicker with datetime-local input */}
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date and time is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  label="Date & Time"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  fullWidth
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="capacity"
              control={control}
              rules={{
                required: "Capacity is required",
                min: {
                  value: 0,
                  message: "Capacity cannot be negative",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Capacity (0 for unlimited)"
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormControl error={!!errors.category} fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    <MenuItem value="Social">Social</MenuItem>
                    <MenuItem value="Educational">Educational</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="meetLink"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Meeting Link (Optional)"
                  error={!!errors.meetLink}
                  helperText={errors.meetLink?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormControl error={!!errors.status} fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="planned">Planned</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
