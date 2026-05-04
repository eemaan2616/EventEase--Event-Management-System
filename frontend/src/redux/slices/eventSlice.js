import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/events', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
  }
});

export const fetchEvent = createAsyncThunk('events/fetchEvent', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/events/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
  }
});

export const fetchMyEvents = createAsyncThunk('events/fetchMyEvents', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/events/organizer/me');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
  }
});

export const createEvent = createAsyncThunk('events/createEvent', async (eventData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/events', eventData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create event');
  }
});

export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, eventData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/events/${id}`, eventData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update event');
  }
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/events/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    event: null,
    myEvents: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {
    clearEvent: (state) => { state.event = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchEvent.pending, (state) => { state.loading = true; })
      .addCase(fetchEvent.fulfilled, (state, action) => { state.loading = false; state.event = action.payload; })
      .addCase(fetchEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchMyEvents.fulfilled, (state, action) => { state.loading = false; state.myEvents = action.payload; })
      .addCase(fetchMyEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createEvent.fulfilled, (state, action) => { state.myEvents.unshift(action.payload); })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.event = action.payload;
        const idx = state.myEvents.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.myEvents[idx] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.myEvents = state.myEvents.filter(e => e._id !== action.payload);
        state.events = state.events.filter(e => e._id !== action.payload);
      });
  },
});

export const { clearEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;
