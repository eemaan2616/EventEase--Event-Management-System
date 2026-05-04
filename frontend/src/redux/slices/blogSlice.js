import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/blogs', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

export const fetchBlog = createAsyncThunk('blogs/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/blogs/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
  }
});

export const createBlog = createAsyncThunk('blogs/create', async (blogData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/blogs', blogData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
  }
});

export const updateBlog = createAsyncThunk('blogs/update', async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/blogs/${id}`, blogData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
  }
});

export const deleteBlog = createAsyncThunk('blogs/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/blogs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    blog: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {
    clearBlog: (state) => { state.blog = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.loading = true; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBlog.pending, (state) => { state.loading = true; })
      .addCase(fetchBlog.fulfilled, (state, action) => { state.loading = false; state.blog = action.payload; })
      .addCase(fetchBlog.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBlog.fulfilled, (state, action) => { state.blogs.unshift(action.payload); })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blog = action.payload;
        const idx = state.blogs.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.blogs[idx] = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b._id !== action.payload);
      });
  },
});

export const { clearBlog } = blogSlice.actions;
export default blogSlice.reducer;
