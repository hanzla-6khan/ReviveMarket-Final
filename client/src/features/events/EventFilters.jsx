import React from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  TuneRounded,
  FilterListRounded,
  SortRounded,
} from "@mui/icons-material";

const EventFilters = ({ filters, setFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const CustomTextField = ({ icon, ...props }) => (
    <TextField
      fullWidth
      size={isMobile ? "small" : "medium"}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: isMobile ? "12px" : "15px",
          bgcolor: "background.paper",
          "&:hover": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton size={isMobile ? "small" : "medium"}>{icon}</IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5 },
        borderRadius: { xs: "15px", sm: "20px" },
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.9)",
          transform: "translateY(-2px)",
        },
        width: "100%",
        maxWidth: { xs: "100%", lg: "1200px" },
        mx: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box sx={{ width: "100%" }}>
          <CustomTextField
            select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            icon={<TuneRounded sx={{ fontSize: isMobile ? 16 : 20 }} />}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Social">
              <Chip
                size={isMobile ? "small" : "medium"}
                label="Social"
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: "white",
                  fontWeight: 500,
                  fontSize: isMobile ? 12 : 14,
                }}
              />
            </MenuItem>
            <MenuItem value="Educational">
              <Chip
                size={isMobile ? "small" : "medium"}
                label="Educational"
                sx={{
                  bgcolor: theme.palette.secondary.light,
                  color: "white",
                  fontWeight: 500,
                  fontSize: isMobile ? 12 : 14,
                }}
              />
            </MenuItem>
            <MenuItem value="Business">
              <Chip
                size={isMobile ? "small" : "medium"}
                label="Business"
                sx={{
                  bgcolor: theme.palette.info.light,
                  color: "white",
                  fontWeight: 500,
                  fontSize: isMobile ? 12 : 14,
                }}
              />
            </MenuItem>
          </CustomTextField>
        </Box>

        <Box sx={{ width: "100%" }}>
          <CustomTextField
            select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            icon={<FilterListRounded sx={{ fontSize: isMobile ? 16 : 20 }} />}
          >
            <MenuItem value="all">All Status</MenuItem>
            {["planned", "ongoing", "completed", "cancelled"].map((status) => (
              <MenuItem value={status} key={status}>
                <Box
                  sx={{
                    width: isMobile ? 6 : 8,
                    height: isMobile ? 6 : 8,
                    borderRadius: "50%",
                    bgcolor: {
                      planned: "#4CAF50",
                      ongoing: "#2196F3",
                      completed: "#9C27B0",
                      cancelled: "#F44336",
                    }[status],
                    mr: 1,
                  }}
                />
                <span style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </MenuItem>
            ))}
          </CustomTextField>
        </Box>

        <Box sx={{ width: "100%" }}>
          <CustomTextField
            select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            icon={<SortRounded sx={{ fontSize: isMobile ? 16 : 20 }} />}
          >
            <MenuItem value="date">
              <span style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Date
              </span>
            </MenuItem>
            <MenuItem value="capacity">
              <span style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Capacity
              </span>
            </MenuItem>
            <MenuItem value="attendees">
              <span style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Attendees
              </span>
            </MenuItem>
          </CustomTextField>
        </Box>
      </Stack>
    </Paper>
  );
};

export default EventFilters;
