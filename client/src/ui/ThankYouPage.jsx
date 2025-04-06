import React from "react";
import { Box, Typography } from "@mui/material";

const ThankYouPage = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Thank You for Your Order!
      </Typography>
      <Typography>Your order has been successfully placed.</Typography>
    </Box>
  );
};

export default ThankYouPage;
