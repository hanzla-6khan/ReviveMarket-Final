import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getConversationMessages,
  getUserConversations,
  sendMessage,
  startConversation,
} from "../../services/messageService";

// Async Actions
export const startNewConversation = createAsyncThunk(
  "messages/startConversation",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await startConversation(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to start conversation"
      );
    }
  }
);

export const sendNewMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessage({
        conversationId,
        content,
      });
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to send message");
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await getConversationMessages(conversationId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch messages"
      );
    }
  }
);

export const fetchUserConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserConversations();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch conversations"
      );
    }
  }
);

// export const markMessageRead = createAsyncThunk(
//   "messages/markRead",
//   async (messageId, { rejectWithValue }) => {
//     try {
//       const response = await markMessageAsRead(messageId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error?.response?.data || "Failed to mark message as read"
//       );
//     }
//   }
// );

// export const archiveUserConversation = createAsyncThunk(
//   "messages/archiveConversation",
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       const response = await archiveConversation(conversationId);
//       return { conversationId, ...response };
//     } catch (error) {
//       return rejectWithValue(
//         error?.response?.data || "Failed to archive conversation"
//       );
//     }
//   }
// );

// Initial State

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
  successMessage: null,
  success: false,
};

// Slice
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    messageReceived: (state, action) => {
      const { message } = action.payload;
      // Check if message already exists to prevent duplicates
      const messageExists = state.messages.some((m) => m._id === message._id);
      if (!messageExists) {
        state.messages.push(message);
      }
    },

    clearMessageError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    resetMessageState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Start Conversation
      .addCase(startNewConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNewConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.unshift(action.payload.conversation);
        state.currentConversation = action.payload.conversation;
        state.success = true;
      })
      .addCase(startNewConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendNewMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.loading = false;
        // state.messages.push(action.payload.message);
        state.successMessage = action.payload.successMessage;

        // Update last message in conversation
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv._id === action.payload.message.conversation
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage =
            new Date().toISOString();
        }
      })
      .addCase(sendNewMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })

      // Fetch Messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Conversations
      .addCase(fetchUserConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //   // Mark Message Read
    //   .addCase(markMessageRead.fulfilled, (state, action) => {
    //     const messageIndex = state.messages.findIndex(
    //       (msg) => msg._id === action.payload.message._id
    //     );
    //     if (messageIndex !== -1) {
    //       state.messages[messageIndex].readStatus = true;
    //     }
    //     if (state.unreadCount > 0) state.unreadCount--;
    //   })

    //   // Archive Conversation
    //   .addCase(archiveUserConversation.fulfilled, (state, action) => {
    //     state.conversations = state.conversations.filter(
    //       (conv) => conv._id !== action.payload.conversationId
    //     );
    //     if (state.currentConversation?._id === action.payload.conversationId) {
    //       state.currentConversation = null;
    //     }
    //   });
  },
});

// Actions
export const {
  clearMessageError,
  setCurrentConversation,
  resetMessageState,
  messageReceived,
} = messageSlice.actions;

export default messageSlice.reducer;
