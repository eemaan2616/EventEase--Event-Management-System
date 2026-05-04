import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/bookings', bookingData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Booking failed');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/bookings/me');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const fetchEventBookings = createAsyncThunk('bookings/fetchEventBookings', async (eventId, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/bookings/event/${eventId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const processPayment = createAsyncThunk('bookings/pay', async (bookingId, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/bookings/${bookingId}/pay`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment failed');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    eventBookings: [],
    currentBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingError: (state) => { state.error = null; },
    clearCurrentBooking: (state) => { state.currentBooking = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => { state.loading = false; state.currentBooking = action.payload; state.bookings.unshift(action.payload); })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchEventBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchEventBookings.fulfilled, (state, action) => { state.loading = false; state.eventBookings = action.payload; })
      .addCase(fetchEventBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(processPayment.pending, (state) => { state.loading = true; })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        const idx = state.bookings.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
