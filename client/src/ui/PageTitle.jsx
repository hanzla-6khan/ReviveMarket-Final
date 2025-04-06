import React from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";

const PageTitle = ({
  title,
  subtitle,
  align = "left",
  divider = true,
  Component = Typography,
  sx = {},
  variant = "h5",
  titleProps = {},
  subtitleProps = {},
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        ...sx,
      }}
    >
      <Component
        variant={variant}
        sx={{
          position: "relative",
          fontWeight: 600,
          color: theme.palette.text.primary,
          textTransform: "capitalize",
          display: "inline-flex",
          alignItems: "center",
          "&::after": divider
            ? {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: align === "center" ? "50%" : 0,
                transform: align === "center" ? "translateX(-50%)" : "none",
                width: align === "center" ? "80px" : "40px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: theme.palette.primary.main,
                transition: theme.transitions.create([
                  "width",
                  "background-color",
                ]),
              }
            : {},
          "&:hover::after": divider
            ? {
                width: align === "center" ? "120px" : "60px",
                backgroundColor: theme.palette.secondary.main,
              }
            : {},
          ...titleProps.sx,
        }}
        {...titleProps}
      >
        {title}
      </Component>

      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 2,
            maxWidth: "600px",
            textAlign: align,
            ...subtitleProps.sx,
          }}
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      )}

      {!divider && (
        <Divider
          sx={{
            width: "100%",
            mt: subtitle ? 3 : 2,
            mb: 2,
          }}
        />
      )}
    </Box>
  );
};

export default PageTitle;
