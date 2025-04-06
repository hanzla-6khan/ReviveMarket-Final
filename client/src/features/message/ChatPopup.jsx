import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { startNewConversation, sendNewMessage } from "./messageSlice";

const ChatPopup = ({ open, onClose, productId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.messages
  );

  const onSubmit = async (data) => {
    try {
      // Start new conversation
      const result = await dispatch(startNewConversation(productId)).unwrap();

      // Send initial message
      if (result.conversation) {
        await dispatch(
          sendNewMessage({
            conversationId: result.conversation._id,
            content: data.message,
          })
        ).unwrap();

        reset();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Message Seller</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {loading && (
        <Alert severity="info" sx={{ mx: 3 }}>
          Sending message...
        </Alert>
      )}

      {!loading && successMessage && (
        <Alert severity="success" sx={{ mx: 3 }}>
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            {...register("message", {
              required: "Message is required",
            })}
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            error={!!errors.message}
            helperText={errors.message?.message}
            disabled={loading}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={loading}
          >
            Send Message
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChatPopup;
