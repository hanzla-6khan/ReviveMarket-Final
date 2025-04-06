import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Card,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  InputAdornment,
  alpha,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchUserConversations,
  fetchConversationMessages,
  sendNewMessage,
  setCurrentConversation,
} from "./messageSlice";

// Styled components
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: "70%",
  backgroundColor: isOwn
    ? theme.palette.primary.main
    : alpha(theme.palette.grey[100], 0.95),
  color: isOwn ? "white" : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  alignSelf: isOwn ? "flex-end" : "flex-start",
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  }),
}));

const MessagesPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    conversations,
    messages,
    loading,
    error,
    currentConversation,
    successMessage,
  } = useSelector((state) => state.messages);

  const { userID } = useSelector((state) => state.auth);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchUserConversations());
  }, [dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (currentConversation) {
      dispatch(fetchConversationMessages(currentConversation._id));
    }
  }, [currentConversation, dispatch]);

  const handleConversationSelect = (conversation) => {
    dispatch(setCurrentConversation(conversation));
  };

  const onSendMessage = async (data) => {
    if (currentConversation) {
      try {
        await dispatch(
          sendNewMessage({
            conversationId: currentConversation._id,
            content: data.message,
          })
        ).unwrap();
        reset();
        setSnackbar({
          open: true,
          message: "Message sent successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to send message: " + error.message,
          severity: "error",
        });
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <MessageIcon
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
              Messages
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your conversations with buyers and sellers
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: isMobile && currentConversation ? "none" : "block",
          }}
        >
          <StyledCard
            sx={{ height: "75vh", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
              <StyledTextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <List sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {conversations?.map((conv) => (
                <StyledListItem
                  key={conv._id}
                  button
                  selected={currentConversation?._id === conv._id}
                  onClick={() => handleConversationSelect(conv)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={conv.product?.image}
                      alt={conv.product?.name}
                      variant="rounded"
                      sx={{ borderRadius: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.otherUser?.name}
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mr: 1 }}
                        >
                          Product: {conv.product?.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {formatTime(conv.updatedAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </StyledListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>

        {/* Chat Window */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: isMobile && !currentConversation ? "none" : "block",
          }}
        >
          <StyledCard
            sx={{ height: "75vh", display: "flex", flexDirection: "column" }}
          >
            {currentConversation ? (
              <>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
                  {isMobile && (
                    <IconButton
                      onClick={() => dispatch(setCurrentConversation(null))}
                      sx={{ mr: 1 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={currentConversation.product?.image}
                      alt={currentConversation.product?.name}
                      variant="rounded"
                      sx={{ borderRadius: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {currentConversation.otherUser?.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Product: {currentConversation.product?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Started{" "}
                          {new Date(
                            currentConversation.createdAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
                  {messages.map((message) => (
                    <Box
                      key={message._id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.sender._id === userID
                            ? "flex-end" // Current user's messages align right
                            : "flex-start", // Other's messages align left
                      }}
                    >
                      <MessageBubble isOwn={message.sender._id === userID}>
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
                        >
                          {formatTime(message.createdAt)}
                        </Typography>
                      </MessageBubble>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSubmit(onSendMessage)}
                  sx={{ p: 3, borderTop: 1, borderColor: "divider" }}
                >
                  <Stack direction="row" spacing={2}>
                    <StyledTextField
                      fullWidth
                      placeholder="Type a message..."
                      {...register("message", {
                        required: "Message is required",
                      })}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      disabled={loading}
                    />
                    <IconButton
                      type="submit"
                      disabled={loading}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </Stack>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <MessageIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a conversation to start messaging
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from your active conversations on the left
                </Typography>
              </Box>
            )}
          </StyledCard>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessagesPage;
