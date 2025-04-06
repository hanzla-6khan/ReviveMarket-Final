import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createEvent,
  fetchAllEvents,
  fetchUserEvents,
  updateEvent,
  joinEvent,
  fetchEventById,
} from "../../services/eventService";

// Create a new event
export const createNewEvent = createAsyncThunk(
  "events/createNewEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await createEvent(eventData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Fetch all events
export const getAllEvents = createAsyncThunk(
  "events/getAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllEvents();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Fetch user's events
export const getUserEvents = createAsyncThunk(
  "events/getUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserEvents();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user events"
      );
    }
  }
);

// Get an event by ID
export const getEventById = createAsyncThunk(
  "events/getEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await fetchEventById(eventId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event"
      );
    }
  }
);

// Update an event
export const updateUserEvent = createAsyncThunk(
  "events/updateUserEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await updateEvent(eventId, eventData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

// Join an event
export const joinUserEvent = createAsyncThunk(
  "events/joinUserEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await joinEvent(eventId);
      return { eventId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to join event"
      );
    }
  }
);

// Initial state
const initialState = {
  events: [], // All events
  userEvents: [],
  event: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

// Event Slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Event
    builder
      .addCase(createNewEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents.push(action.payload.event);
        state.successMessage = action.payload.message;
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    //   Get Event By ID
    builder
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload.event;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Event
    builder
      .addCase(updateUserEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update in main events array
        const eventIndex = state.events.findIndex(
          (event) => event._id === action.payload.event._id
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload.event;
        }
        // Update in user events array
        const userEventIndex = state.userEvents.findIndex(
          (event) => event._id === action.payload.event._id
        );
        if (userEventIndex !== -1) {
          state.userEvents[userEventIndex] = action.payload.event;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateUserEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch All Events
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch User Events
    builder
      .addCase(getUserEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = action.payload.events;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Join Event
    builder
      .addCase(joinUserEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(joinUserEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the event in the events array to reflect the new attendee
        const eventIndex = state.events.findIndex(
          (event) => event._id === action.payload.eventId
        );
        if (eventIndex !== -1) {
          state.events[eventIndex].attendees.push(action.meta.arg);
        }
        state.successMessage = action.payload.message;
      })
      .addCase(joinUserEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

// Actions
export const { clearMessages } = eventSlice.actions;

// Reducer
export default eventSlice.reducer;
