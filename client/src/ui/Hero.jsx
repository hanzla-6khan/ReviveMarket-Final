import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  useTheme,
} from "@mui/material";
import { HiArrowRight, HiOutlineGift } from "react-icons/hi";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Hero = () => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, #2E7D32CC 0%, #1565C0CC 100%)`,
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          backgroundImage: `url('/api/placeholder/1920/1080')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Stack
            spacing={4}
            sx={{
              maxWidth: "800px",
              animation: `${fadeIn} 1s ease-out`,
              py: { xs: 8, md: 12 },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "full",
                px: 3,
                py: 1,
                width: "fit-content",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#4CAF50",
                  fontWeight: "600",
                }}
              >
                Sustainable Shopping Redefined
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Give Pre-loved Items a New Home
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "normal",
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Join our innovative marketplace where buying, selling, and
              donating second-hand items becomes an engaging experience. Make
              sustainable choices while building community connections.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<HiArrowRight />}
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: `linear-gradient(45deg, #2E7D32, #1565C0)`,
                  boxShadow: "0 4px 14px 0 rgba(46, 125, 50, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px 0 rgba(46, 125, 50, 0.6)",
                  },
                }}
              >
                Start Shopping
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<HiOutlineGift />}
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Make a Donation
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={4}
              sx={{
                mt: 8,
                pt: 4,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {[
                { number: "50K+", label: "Items Listed" },
                { number: "10K+", label: "Happy Users" },
                { number: "5K+", label: "Items Donated" },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      mb: 1,
                      background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Hero;
