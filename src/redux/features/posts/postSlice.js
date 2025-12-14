"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH POSTS ================= */
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 5, author = "", tag = "", sort = "newest" }) => {
    let url = `/api/posts?limit=${limit}&page=${page}&sort=${sort}`;
    if (author) url += `&author=${author}`;
    if (tag) url += `&tag=${tag}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch posts");

    return await res.json();
  }
);

/* ================= CREATE POST ================= */
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      // postData.image should already be a URL string from frontend
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

/* ================= UPDATE POST ================= */
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const updated = await res.json();
      if (!res.ok) return rejectWithValue(updated);

      return updated;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

/* ================= DELETE POST ================= */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      return slug;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

/* ================= SLICE ================= */
const postSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH POSTS
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.posts || action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })

      // CREATE POST
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Create post failed";
      })

      // UPDATE POST
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((post) =>
          post.slug === action.payload.slug ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Update post failed";
      })

      // DELETE POST
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((post) => post.slug !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Delete post failed";
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
