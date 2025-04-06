import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Stack,
  InputAdornment,
  Paper,
  Grid,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import useImageUpload from "../../hooks/useImageUpload";

// Constants remain the same as in your original code
const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Other",
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ProductForm = ({ open, onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const {
    imageFile,
    setImageFile,
    uploadProgress,
    imageFileUrl,
    imageEdited,
    setImageEdited,
  } = useImageUpload();

  // State to handle image preview separately from upload
  const [imagePreview, setImagePreview] = useState(
    initialData?.imageUrl || null
  );
  const [imageError, setImageError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      price: initialData?.price || "",
      condition: initialData?.condition || "new",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    reset({
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      price: initialData?.price || "",
      condition: initialData?.condition || "new",
    });
    setImagePreview(initialData?.imageUrl || null);
    setImageEdited(false);
  }, [initialData, reset, setImageEdited]);

  // Handle image upload and validation
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageError("");

    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image size should be less than 5MB");
      return;
    }

    // Create preview URL and start upload
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    setImageEdited(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageError("");
    setImageEdited(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      console.log(imageFileUrl);
      // Determine which image URL to use
      let finalImageUrl = null;

      if (imageEdited) {
        // If image was edited, use new URL or null if image was removed
        finalImageUrl = imageFileUrl;
      } else {
        // If image wasn't edited, keep the original URL
        finalImageUrl = initialData?.imageUrl || null;
      }

      // Combine form data with image URL
      const finalData = {
        ...data,
        image: finalImageUrl,
      };

      await onSubmit(finalData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setImageError("Error saving product. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {initialData?._id ? "Edit Product" : "Create New Product"}
        </Typography>
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          sx={{
            color: theme.palette.grey[500],
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {/* Left Column - Image Upload */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.palette.grey[50],
                  border: `1px dashed ${theme.palette.grey[300]}`,
                  borderRadius: 2,
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: theme.shape.borderRadius,
                      }}
                    />
                    <IconButton
                      onClick={removeImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      height: "100%",
                      minHeight: 200,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      border: "none",
                      "&:hover": {
                        backgroundColor: theme.palette.grey[100],
                      },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handleImageUpload}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Upload Product Image
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      JPEG, PNG or WebP (max. 2MB)
                    </Typography>
                  </Button>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Uploading: {uploadProgress}%
                    </Typography>
                  </Box>
                )}
                {imageError && (
                  <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                    {imageError}
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Right Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2.5}>
                {/* Form fields remain the same as in your original code */}
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Product name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
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
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  )}
                />

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Category"
                          fullWidth
                          error={!!errors.category}
                          helperText={errors.category?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 1 },
                          }}
                        >
                          {CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="condition"
                      control={control}
                      rules={{ required: "Condition is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Condition"
                          fullWidth
                          error={!!errors.condition}
                          helperText={errors.condition?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 1 },
                          }}
                        >
                          {CONDITIONS.map((condition) => (
                            <MenuItem
                              key={condition.value}
                              value={condition.value}
                            >
                              {condition.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Price is required",
                    min: { value: 0, message: "Price must be greater than 0" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">PKR</InputAdornment>
                        ),
                      }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  )}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.default,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            textTransform: "none",
            px: 3,
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[700],
            "&:hover": {
              borderColor: theme.palette.grey[400],
              backgroundColor: theme.palette.grey[50],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={
            isSubmitting || (uploadProgress > 0 && uploadProgress < 100)
          }
          sx={{
            borderRadius: 1,
            textTransform: "none",
            px: 3,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {isSubmitting
            ? "Saving..."
            : initialData?._id
            ? "Save Changes"
            : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
