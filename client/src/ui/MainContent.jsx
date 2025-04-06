import React from "react";
import { Box, Typography } from "@mui/material";

const MainContent = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        This is where your main content will go. You can add different sections
        or widgets here.
      </Typography>
      <Box sx={{ mt: 2 }}>
        {/* Example of content overflow */}
        {Array.from({ length: 50 }).map((_, i) => (
          <Typography key={i} variant="body2">
            Sample content line {i + 1}.
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default MainContent;
